import { describe, expect, it, test } from 'vitest';

/* =====================================================================
   MODULE #1: filterPreviewItems — C=50 (9 if/else branches, 10 return paths)
   Source: src/domain/preview-gallery.ts
   ===================================================================== */
import {
  filterPreviewItems,
  buildPreviewGalleryItem,
  derivePreviewReviewStatus,
  canClientViewPreview,
  groupBeforeAfterPairs,
  summarizePreviewGallery,
  buildBulkPreviewApprovalDraft,
} from '@/domain/preview-gallery';
import type { PreviewGalleryItem, PreviewProcessedFileInput } from '@/domain/preview-gallery';

function makeItem(overrides: Partial<PreviewGalleryItem> & { id?: string }): PreviewGalleryItem {
  return {
    id: overrides.id ?? 'test-id',
    imageId: null,
    originalName: null,
    originalStorageKey: null,
    outputFileName: 'test.jpg',
    previewUrl: null,
    thumbnailUrl: null,
    storageKey: null,
    outputType: 'SQUARE_JPG',
    outputFormat: null,
    presetKey: null,
    platform: null,
    width: null,
    height: null,
    qualityScore: null,
    status: 'READY_FOR_REVIEW',
    approvedStatus: null,
    qualityFlags: null,
    adminNotes: null,
    clientNotes: null,
    reviewStatus: 'READY_FOR_REVIEW',
    visibility: 'ADMIN_ONLY',
    clientVisible: false,
    needsAdminReview: true,
    flags: [],
    safeClaim: 'Preview only.',
    ...overrides,
  };
}

describe('filterPreviewItems — branch coverage', () => {
  const items = [
    makeItem({ id: 'a', outputType: 'WHITE_JPG', presetKey: 'amazon-main', platform: 'Amazon', reviewStatus: 'APPROVED' }),
    makeItem({ id: 'b', outputType: 'TRANSPARENT_PNG', presetKey: 'transparent-cutout', platform: 'PNG', reviewStatus: 'READY_FOR_REVIEW' }),
    makeItem({ id: 'c', outputType: 'SQUARE_JPG', presetKey: 'etsy-square', platform: 'Etsy', reviewStatus: 'FLAGGED', flags: ['edge_artifact'] }),
    makeItem({ id: 'd', outputType: 'SQUARE_JPG', presetKey: null, platform: null, reviewStatus: 'FAILED' }),
    makeItem({ id: 'e', outputType: 'WHITE_JPG', presetKey: 'amazon-main', platform: 'Amazon', reviewStatus: 'REJECTED' }),
  ];

  it('filters by outputTypes (non-matching excluded)', () => {
    expect(filterPreviewItems(items, { outputTypes: ['WHITE_JPG'] }).map((i) => i.id)).toEqual(['a', 'e']);
  });
  it('passes all when outputTypes is empty', () => {
    expect(filterPreviewItems(items, { outputTypes: [] })).toHaveLength(5);
  });
  it('passes all when outputTypes is undefined', () => {
    expect(filterPreviewItems(items, {})).toHaveLength(5);
  });
  it('filters by presetKeys (null presetKey excluded)', () => {
    expect(filterPreviewItems(items, { presetKeys: ['amazon-main'] }).map((i) => i.id)).toEqual(['a', 'e']);
  });
  it('excludes items with null presetKey when filtering by presetKeys', () => {
    expect(filterPreviewItems(items, { presetKeys: ['etsy-square'] }).map((i) => i.id)).toEqual(['c']);
  });
  it('filters by platform', () => {
    expect(filterPreviewItems(items, { platforms: ['Amazon'] }).map((i) => i.id)).toEqual(['a', 'e']);
  });
  it('excludes items with null platform when filtering by platform', () => {
    expect(filterPreviewItems(items, { platforms: ['Etsy'] }).map((i) => i.id)).toEqual(['c']);
  });
  it('filters by reviewStatuses', () => {
    expect(filterPreviewItems(items, { reviewStatuses: ['approved', 'ready_for_review'] }).map((i) => i.id)).toEqual(['a', 'b']);
  });
  it('filters approvedOnly correctly', () => {
    expect(filterPreviewItems(items, { approvedOnly: true }).map((i) => i.id)).toEqual(['a']);
  });
  it('excludes flagged when includeFlagged=false', () => {
    const r = filterPreviewItems(items, { includeFlagged: false });
    expect(r.map((i) => i.id)).not.toContain('c');
    expect(r).toHaveLength(4);
  });
  it('excludes failed when includeFailed=false', () => {
    const r = filterPreviewItems(items, { includeFailed: false });
    expect(r.map((i) => i.id)).not.toContain('d');
    expect(r).toHaveLength(4);
  });
  it('filters by search string (match on outputFileName)', () => {
    expect(filterPreviewItems(items, { search: 'test' }).length).toBeGreaterThan(0);
  });
  it('filters by search string (no match returns empty)', () => {
    expect(filterPreviewItems(items, { search: 'zzzznotfound' })).toHaveLength(0);
  });
  it('searches concatenated fields including platform', () => {
    expect(filterPreviewItems(items, { search: 'amazon' }).map((i) => i.id)).toEqual(['a', 'e']);
  });
  it('combines multiple filters', () => {
    expect(filterPreviewItems(items, { outputTypes: ['WHITE_JPG'], platforms: ['Amazon'], includeFailed: false }).map((i) => i.id)).toEqual(['a', 'e']);
  });
  it('handles empty items array', () => {
    expect(filterPreviewItems([], {})).toEqual([]);
  });
  it('returns all items with no filters', () => {
    expect(filterPreviewItems(items)).toHaveLength(5);
  });
});

describe('derivePreviewReviewStatus — branch coverage', () => {
  it('returns FAILED when status is FAILED', () => expect(derivePreviewReviewStatus({ status: 'FAILED', approvedStatus: null, qualityFlags: null })).toBe('FAILED'));
  it('returns REJECTED when status is REJECTED', () => expect(derivePreviewReviewStatus({ status: 'REJECTED', approvedStatus: null, qualityFlags: null })).toBe('REJECTED'));
  it('returns REJECTED when approvedStatus is REJECTED', () => expect(derivePreviewReviewStatus({ status: 'READY_FOR_REVIEW', approvedStatus: 'REJECTED', qualityFlags: null })).toBe('REJECTED'));
  it('returns FLAGGED when status is FLAGGED', () => expect(derivePreviewReviewStatus({ status: 'FLAGGED', approvedStatus: null, qualityFlags: null })).toBe('FLAGGED'));
  it('returns FLAGGED when qualityFlags has entries', () => expect(derivePreviewReviewStatus({ status: 'READY_FOR_REVIEW', approvedStatus: null, qualityFlags: ['edge_artifact'] })).toBe('FLAGGED'));
  it('returns APPROVED when status is APPROVED', () => expect(derivePreviewReviewStatus({ status: 'APPROVED', approvedStatus: null, qualityFlags: null })).toBe('APPROVED'));
  it('returns APPROVED when approvedStatus is APPROVED', () => expect(derivePreviewReviewStatus({ status: 'READY_FOR_REVIEW', approvedStatus: 'APPROVED', qualityFlags: null })).toBe('APPROVED'));
  it('returns READY_FOR_REVIEW as default fallback', () => expect(derivePreviewReviewStatus({ status: 'READY_FOR_REVIEW', approvedStatus: null, qualityFlags: null })).toBe('READY_FOR_REVIEW'));
});

describe('buildPreviewGalleryItem — branch coverage', () => {
  it('adds processing_failed flag for FAILED items without it', () => {
    const item = buildPreviewGalleryItem({ id: 'x', outputFileName: 'x.jpg', outputType: 'JPG', status: 'FAILED', qualityFlags: [] });
    expect(item.flags).toContain('processing_failed');
  });
  it('adds needs_quality_review for FLAGGED items without existing flags', () => {
    const item = buildPreviewGalleryItem({ id: 'y', outputFileName: 'y.jpg', outputType: 'JPG', status: 'FLAGGED', qualityFlags: [] });
    expect(item.flags).toContain('needs_quality_review');
  });
  it('does not add needs_quality_review when flags already present', () => {
    const item = buildPreviewGalleryItem({ id: 'z', outputFileName: 'z.jpg', outputType: 'JPG', status: 'READY_FOR_REVIEW', qualityFlags: ['edge_artifact'] });
    expect(item.reviewStatus).toBe('FLAGGED');
    expect(item.flags).toEqual(['edge_artifact']);
  });
  it('sets CLIENT_VISIBLE when client preview enabled and approved', () => {
    const item = buildPreviewGalleryItem({ id: 'w', outputFileName: 'w.jpg', outputType: 'JPG', status: 'APPROVED', approvedStatus: 'APPROVED' }, { clientPreviewEnabled: true });
    expect(item.visibility).toBe('CLIENT_VISIBLE');
  });
  it('sets ADMIN_ONLY when client preview is disabled', () => {
    const item = buildPreviewGalleryItem({ id: 'v', outputFileName: 'v.jpg', outputType: 'JPG', status: 'APPROVED', approvedStatus: 'APPROVED' });
    expect(item.visibility).toBe('ADMIN_ONLY');
  });
});

describe('groupBeforeAfterPairs — branch coverage', () => {
  it('groups items by imageId', () => {
    const pairs = groupBeforeAfterPairs([
      makeItem({ id: 'a', imageId: 'img1', originalName: 'photo1.jpg' }),
      makeItem({ id: 'b', imageId: 'img1', originalName: 'photo1.jpg' }),
      makeItem({ id: 'c', imageId: 'img2', originalName: 'photo2.jpg' }),
    ]);
    expect(pairs).toHaveLength(2);
    expect(pairs.find((p) => p.imageId === 'img1')?.outputs).toHaveLength(2);
  });
  it('uses id as fallback key when imageId is missing', () => {
    expect(groupBeforeAfterPairs([makeItem({ id: 'orphan-1', imageId: null }), makeItem({ id: 'orphan-2', imageId: null })])).toHaveLength(2);
  });
  it('selects approved output as bestOutput', () => {
    const pairs = groupBeforeAfterPairs([makeItem({ id: 'a', imageId: 'img1', reviewStatus: 'READY_FOR_REVIEW' }), makeItem({ id: 'b', imageId: 'img1', reviewStatus: 'APPROVED' })]);
    expect(pairs[0].bestOutput?.id).toBe('b');
  });
  it('falls back to first output when none approved or ready', () => {
    const pairs = groupBeforeAfterPairs([makeItem({ id: 'a', imageId: 'img1', reviewStatus: 'FLAGGED' })]);
    expect(pairs[0].bestOutput?.id).toBe('a');
  });
});

describe('summarizePreviewGallery — branch coverage', () => {
  it('summarizes counts correctly', () => {
    const s = summarizePreviewGallery([
      makeItem({ id: 'a', reviewStatus: 'APPROVED', clientVisible: true }),
      makeItem({ id: 'b', reviewStatus: 'READY_FOR_REVIEW', clientVisible: false }),
      makeItem({ id: 'c', reviewStatus: 'FLAGGED', clientVisible: false }),
      makeItem({ id: 'd', reviewStatus: 'FAILED', clientVisible: false }),
      makeItem({ id: 'e', reviewStatus: 'REJECTED', clientVisible: false }),
    ]);
    expect(s.total).toBe(5);
    expect(s.approved).toBe(1);
    expect(s.readyForReview).toBe(1);
    expect(s.flagged).toBe(1);
    expect(s.failed).toBe(1);
    expect(s.rejected).toBe(1);
    expect(s.clientVisible).toBe(1);
  });
  it('handles empty items', () => {
    expect(summarizePreviewGallery([]).total).toBe(0);
  });
});

describe('buildBulkPreviewApprovalDraft — branch coverage', () => {
  it('identifies approvable items', () => {
    const draft = buildBulkPreviewApprovalDraft([makeItem({ id: 'a', reviewStatus: 'READY_FOR_REVIEW', approvedStatus: 'PENDING' }), makeItem({ id: 'b', reviewStatus: 'APPROVED', approvedStatus: 'APPROVED' })], ['a', 'b']);
    expect(draft.approvableCount).toBe(1);
    expect(draft.approvableIds).toEqual(['a']);
  });
  it('handles no matching selections', () => {
    expect(buildBulkPreviewApprovalDraft([makeItem({ id: 'a', reviewStatus: 'READY_FOR_REVIEW' })], []).selectedCount).toBe(0);
  });
});

/* =====================================================================
   MODULE #2: evaluateDeliveryAccess — C=21 (9 if/else branches, depth-3 nesting)
   Source: src/domain/delivery-notifications.ts
   ===================================================================== */
import {
  evaluateDeliveryAccess,
  normalizeDeliveryStatus,
  isDeliveryReadyJobStatus,
  redactEmailAddress,
  buildMarketplaceDeliveryMessage,
  buildDeliveryNotificationSubject,
} from '@/domain/delivery-notifications';

describe('evaluateDeliveryAccess — branch coverage', () => {
  const farFuture = new Date('2199-01-01');
  const midFuture = new Date('2099-01-01');
  const pastDate = new Date('2020-01-01');

  it('blocks when deliveryLinkStatus is not ACTIVE', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j1', jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'INACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: farFuture, tokenRevokedAt: null, approvedAt: midFuture, deliveryArchiveApprovedAt: midFuture, downloadCount: 0, maxDownloads: 5, now: midFuture });
    expect(r.blockers).toContain('Delivery link is not active.');
    expect(r.allowed).toBe(false);
  });
  it('passes the link status check when ACTIVE', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j2', jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: farFuture, tokenRevokedAt: null, approvedAt: midFuture, deliveryArchiveApprovedAt: midFuture, downloadCount: 0, maxDownloads: 5, now: midFuture });
    expect(r.blockers).not.toContain('Delivery link is not active.');
  });
  it('blocks when token is revoked', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j3', jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: farFuture, tokenRevokedAt: pastDate, approvedAt: midFuture, deliveryArchiveApprovedAt: midFuture, downloadCount: 0, maxDownloads: 5, now: midFuture });
    expect(r.blockers).toContain('Delivery link has been revoked.');
    expect(r.publicStatus).toBe('REVOKED');
  });
  it('blocks when link has expired', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j4', jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: pastDate, tokenRevokedAt: null, approvedAt: midFuture, deliveryArchiveApprovedAt: midFuture, downloadCount: 0, maxDownloads: 5, now: midFuture });
    expect(r.blockers).toContain('Delivery link has expired.');
    expect(r.publicStatus).toBe('EXPIRED');
  });
  it('blocks when job status is not delivery-ready', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j5', jobStatus: 'DRAFT', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: farFuture, tokenRevokedAt: null, approvedAt: midFuture, deliveryArchiveApprovedAt: midFuture, downloadCount: 0, maxDownloads: 5, now: midFuture });
    expect(r.blockers).toContain('Job is not ready for delivery.');
  });
  it('blocks when approvedAt is missing', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j6', jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: farFuture, tokenRevokedAt: null, approvedAt: null, deliveryArchiveApprovedAt: midFuture, downloadCount: 0, maxDownloads: 5, now: midFuture });
    expect(r.blockers).toContain('Job has not received manual admin approval.');
  });
  it('blocks when archive status is not APPROVED', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j7', jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'DRAFT', tokenExpiresAt: farFuture, tokenRevokedAt: null, approvedAt: midFuture, deliveryArchiveApprovedAt: midFuture, downloadCount: 0, maxDownloads: 5, now: midFuture });
    expect(r.blockers).toContain('Delivery archive is not approved.');
  });
  it('blocks when archive approval timestamp is missing', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j8', jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: farFuture, tokenRevokedAt: null, approvedAt: midFuture, deliveryArchiveApprovedAt: null, downloadCount: 0, maxDownloads: 5, now: midFuture });
    expect(r.blockers).toContain('Delivery archive approval timestamp is missing.');
  });
  it('blocks when download limit reached', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j9', jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: farFuture, tokenRevokedAt: null, approvedAt: midFuture, deliveryArchiveApprovedAt: midFuture, downloadCount: 5, maxDownloads: 5, now: midFuture });
    expect(r.blockers).toContain('Delivery link download limit has been reached.');
    expect(r.publicStatus).toBe('LIMIT_REACHED');
  });
  it('does not block when maxDownloads is null', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j10', jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: farFuture, tokenRevokedAt: null, approvedAt: midFuture, deliveryArchiveApprovedAt: midFuture, downloadCount: 50, maxDownloads: null, now: midFuture });
    expect(r.allowed).toBe(true);
  });
  it('adds warning when near download limit', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j11', jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: farFuture, tokenRevokedAt: null, approvedAt: midFuture, deliveryArchiveApprovedAt: midFuture, downloadCount: 4, maxDownloads: 5, now: midFuture });
    expect(r.warnings).toContain('This delivery link is close to its download limit.');
  });
  it('allows access when all checks pass', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j12', jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: farFuture, tokenRevokedAt: null, approvedAt: midFuture, deliveryArchiveApprovedAt: midFuture, downloadCount: 0, maxDownloads: 5, now: midFuture });
    expect(r.allowed).toBe(true);
    expect(r.publicStatus).toBe('AVAILABLE');
    expect(r.blockers).toHaveLength(0);
  });
  it('returns NOT_READY when blockers exist but not expired/revoked/limit', () => {
    const r = evaluateDeliveryAccess({ jobId: 'j13', jobStatus: 'DRAFT', deliveryLinkStatus: 'ACTIVE', deliveryArchiveStatus: 'APPROVED', tokenExpiresAt: farFuture, tokenRevokedAt: null, approvedAt: midFuture, deliveryArchiveApprovedAt: midFuture, downloadCount: 0, maxDownloads: 5, now: midFuture });
    expect(r.publicStatus).toBe('NOT_READY');
  });
});

describe('delivery-helper functions', () => {
  it('accepts DELIVERED and COMPLETED as delivery-ready', () => {
    expect(isDeliveryReadyJobStatus('DELIVERED')).toBe(true);
    expect(isDeliveryReadyJobStatus('COMPLETED')).toBe(true);
    expect(isDeliveryReadyJobStatus(null)).toBe(false);
    expect(isDeliveryReadyJobStatus(undefined)).toBe(false);
  });
  it('handles null delivery status', () => {
    expect(normalizeDeliveryStatus(null)).toBe('');
  });
  it('trims delivery status', () => {
    expect(normalizeDeliveryStatus('  active  ')).toBe('ACTIVE');
  });
  it('redacts email address', () => {
    expect(redactEmailAddress('john@example.com')).toBe('j***@example.com');
    expect(redactEmailAddress('a@b.co')).toBe('a***@b.co');
  });
});

describe('buildMarketplaceDeliveryMessage — branch coverage', () => {
  const opts = { downloadUrl: 'https://example.com/dl', expiresAt: new Date('2099-01-01') };
  it('uses platform-specific note for Fiverr', () => {
    expect(buildMarketplaceDeliveryMessage({ templateKey: 'FIVERR', ...opts })).toContain('deliver inside this platform');
  });
  it('uses generic note for non-platform templates', () => {
    expect(buildMarketplaceDeliveryMessage({ templateKey: 'ETSY', ...opts })).toContain('review the images before publishing');
  });
  it('falls back to "there" when buyerName is null', () => {
    expect(buildMarketplaceDeliveryMessage({ templateKey: 'SHOPIFY', ...opts })).toContain('Hi there');
  });
  it('includes custom revisionInstructions', () => {
    expect(buildMarketplaceDeliveryMessage({ templateKey: 'DIRECT_WEBSITE', ...opts, revisionInstructions: 'Send feedback.' })).toContain('Send feedback.');
  });
});

describe('buildDeliveryNotificationSubject', () => {
  it('includes job number prefix', () => expect(buildDeliveryNotificationSubject('DOWNLOAD_READY', 'LL-202601-00001')).toContain('LL-202601-00001'));
  it('uses generic prefix without job number', () => expect(buildDeliveryNotificationSubject('UPLOAD_RECEIVED')).toBe('ListingLift: Upload received'));
});

/* =====================================================================
   MODULE #3: validatePresetDefinition — C=15 (8 validations + try-catch)
   Source: src/domain/platform-presets.ts
   ===================================================================== */
import {
  validatePresetDefinition,
  assertValidPresetDefinition,
  normalizeFolderPath,
  sanitizePathSegment,
  buildPresetFileName,
  buildPresetOutputPlan,
  createCustomPresetDraft,
  extensionForFormat,
  deriveAspectRatio,
  DEFAULT_PLATFORM_PRESETS,
  getPresetCoverageReport,
} from '@/domain/platform-presets';
import type { PlatformPreset, OutputFormat, BackgroundType } from '@/domain/platform-presets';

describe('validatePresetDefinition — branch coverage', () => {
  const valid = { key: 'TestPreset', width: 800, height: 600, format: 'JPG' as OutputFormat, folderPath: 'Test/folder', safeMarginPercent: 5, namingConvention: '{sku}_{index}.jpg', safeLanguage: 'platform-ready draft; seller-review recommended', marketplaceSafeClaim: 'Formatted for common marketplace use. Review against current guidelines.' };

  it('rejects empty preset key', () => expect(validatePresetDefinition({ ...valid, key: '  ' })).toContain('Preset key is required.'));
  it('rejects non-integer width', () => expect(validatePresetDefinition({ ...valid, width: 100.5 })).toContain('Preset width must be an integer of at least 64 pixels.'));
  it('rejects width below 64', () => expect(validatePresetDefinition({ ...valid, width: 32, height: 32 })).toContain('Preset width must be an integer of at least 64 pixels.'));
  it('rejects height below 64', () => expect(validatePresetDefinition({ ...valid, width: 800, height: 16 })).toContain('Preset height must be an integer of at least 64 pixels.'));
  it('rejects empty format', () => expect(validatePresetDefinition({ ...valid, format: '' as OutputFormat })).toContain('Preset format is required.'));
  it('rejects negative safeMarginPercent', () => expect(validatePresetDefinition({ ...valid, safeMarginPercent: -1 })).toContain('Safe margin percent must be between 0 and 25.'));
  it('rejects safeMarginPercent > 25', () => expect(validatePresetDefinition({ ...valid, safeMarginPercent: 30 })).toContain('Safe margin percent must be between 0 and 25.'));
  it('rejects NaN safeMarginPercent', () => expect(validatePresetDefinition({ ...valid, safeMarginPercent: NaN })).toContain('Safe margin percent must be between 0 and 25.'));
  it('rejects naming convention without {index}', () => expect(validatePresetDefinition({ ...valid, namingConvention: 'test.jpg' })).toContain('Naming convention must include {index}.'));
  it('rejects safe language without seller-review', () => expect(validatePresetDefinition({ ...valid, safeLanguage: 'just a file' })).toContain('Preset safe language must include seller-review wording.'));
  it('rejects marketplaceSafeClaim with guarantee', () => expect(validatePresetDefinition({ ...valid, marketplaceSafeClaim: 'This guarantees approval' })).toContain('Marketplace safe claim contains prohibited guarantee language.'));
  it('rejects marketplaceSafeClaim with conversion increase', () => expect(validatePresetDefinition({ ...valid, marketplaceSafeClaim: 'Products guarantee conversion increase' })).toContain('Marketplace safe claim contains prohibited guarantee language.'));
  it('returns empty issues for valid preset', () => expect(validatePresetDefinition(valid)).toHaveLength(0));
});

describe('assertValidPresetDefinition', () => {
  it('throws on invalid preset', () => expect(() => assertValidPresetDefinition({ ...({} as PlatformPreset), key: '  ', width: 10 })).toThrow());
  it('returns valid preset unchanged', () => expect(assertValidPresetDefinition(DEFAULT_PLATFORM_PRESETS[0])).toBe(DEFAULT_PLATFORM_PRESETS[0]));
});

describe('buildPresetFileName — branch coverage', () => {
  it('uses sku as primary stem', () => {
    expect(buildPresetFileName({ sku: 'PROD-001', index: 1, preset: { namingConvention: '{sku}_{index}', format: 'JPG' as OutputFormat } })).toContain('prod-001');
  });
  it('falls back to productName when sku is null', () => {
    expect(buildPresetFileName({ sku: null, productName: 'My Product', sourceFileBaseName: 'source', index: 1, preset: { namingConvention: '{product}_{index}', format: 'PNG' as OutputFormat } })).toContain('my-product');
  });
  it('falls back to sourceFileBaseName', () => {
    expect(buildPresetFileName({ sku: null, productName: null, sourceFileBaseName: 'original-file', index: 1, preset: { namingConvention: '{source}_{index}', format: 'WEBP' as OutputFormat } })).toContain('original-file');
  });
  it('defaults to untitled when all stem sources are null', () => {
    expect(buildPresetFileName({ index: 1, preset: { namingConvention: '{sku}_{index}', format: 'JPG' as OutputFormat } })).toContain('product');
  });
  it('pads index with leading zero', () => {
    expect(buildPresetFileName({ sku: 'SKU', index: 5, preset: { namingConvention: '{sku}_{index}', format: 'JPG' as OutputFormat } })).toContain('_05');
  });
  it('appends extension if missing from convention', () => {
    expect(buildPresetFileName({ sku: 'SKU', index: 1, preset: { namingConvention: '{sku}_{index}', format: 'JPG' as OutputFormat } })).toMatch(/\.jpg$/);
  });
  it('does not duplicate existing extension', () => {
    expect(buildPresetFileName({ sku: 'SKU', index: 1, preset: { namingConvention: '{sku}_{index}.jpg', format: 'JPG' as OutputFormat } })).toMatch(/\.jpg$/);
  });
});

describe('buildPresetOutputPlan', () => {
  it('builds output plan from preset key', () => {
    const plan = buildPresetOutputPlan({ presetKey: 'AmazonMainImageDraft', clientName: 'Client', jobId: 'j1', sku: 'SKU', index: 1 });
    expect(plan.presetKey).toBe('AmazonMainImageDraft');
    expect(plan.width).toBe(2000);
  });
  it('throws for unknown preset key', () => {
    expect(() => buildPresetOutputPlan({ presetKey: 'NonexistentPreset', clientName: 'Client', jobId: 'j1', index: 1 })).toThrow('Unknown preset');
  });
});

describe('createCustomPresetDraft — branch coverage', () => {
  it('creates valid custom preset', () => {
    const d = createCustomPresetDraft({ organizationSlug: 'my-org', name: 'Banner', platform: 'Website', width: 1200, height: 400, format: 'WEBP', background: 'BRAND_COLOR' as BackgroundType, folderPath: 'Custom/banners' });
    expect(d.key).toContain('custom_my-org');
    expect(d.orientation).toBe('horizontal');
  });
  it('detects square orientation', () => {
    expect(createCustomPresetDraft({ organizationSlug: 'org', name: 'Square', width: 1000, height: 1000, format: 'JPG', background: 'WHITE', folderPath: 'Custom/s' }).orientation).toBe('square');
  });
  it('detects vertical orientation', () => {
    expect(createCustomPresetDraft({ organizationSlug: 'org', name: 'Vertical', width: 500, height: 800, format: 'PNG', background: 'TRANSPARENT', folderPath: 'Custom/v' }).orientation).toBe('vertical');
  });
  it('sets supportsTransparent true when format is PNG', () => {
    const d = createCustomPresetDraft({ organizationSlug: 'org', name: 'T', width: 500, height: 500, format: 'PNG', background: 'WHITE', folderPath: 'Custom/png' });
    expect(d.supportsTransparent).toBe(true);
  });
});

describe('normalizeFolderPath', () => {
  it('normalizes a valid path', () => expect(normalizeFolderPath('Test/Folder')).toBe('Test/Folder'));
  it('throws on leading slash', () => expect(() => normalizeFolderPath('/Test/Folder/')).toThrow('Folder path must be relative'));
  it('throws on empty path', () => expect(() => normalizeFolderPath('')).toThrow('Folder path is required.'));
});

describe('DEFAULT_PLATFORM_PRESETS', () => {
  it('has predefined presets', () => expect(DEFAULT_PLATFORM_PRESETS.length).toBeGreaterThan(10));
  it('all presets pass validation', () => { for (const p of DEFAULT_PLATFORM_PRESETS) expect(() => assertValidPresetDefinition(p)).not.toThrow(); });
  it('each preset has unique key', () => {
    const keys = DEFAULT_PLATFORM_PRESETS.map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('extensionForFormat', () => {
  it('handles JPG', () => expect(extensionForFormat('JPG')).toBe('jpg'));
  it('handles JPEG', () => expect(extensionForFormat('JPEG' as OutputFormat)).toBe('jpeg'));
  it('handles PNG', () => expect(extensionForFormat('PNG')).toBe('png'));
  it('handles WEBP', () => expect(extensionForFormat('WEBP')).toBe('webp'));
  it('handles ZIP', () => expect(extensionForFormat('ZIP')).toBe('zip'));
});

describe('deriveAspectRatio', () => {
  it('derives 1:1 from equal dimensions', () => expect(deriveAspectRatio(1000, 1000)).toBe('1:1'));
  it('derives 4:3', () => expect(deriveAspectRatio(1600, 1200)).toBe('4:3'));
  it('derives 16:9', () => expect(deriveAspectRatio(1920, 1080)).toBe('16:9'));
  it('derives 3:2 from 1500x1000', () => expect(deriveAspectRatio(1500, 1000)).toBe('3:2'));
});

describe('sanitizePathSegment', () => {
  it('replaces invalid chars and spaces with hyphens', () => expect(sanitizePathSegment('hello world')).toBe('hello-world'));
  it('handles empty string', () => expect(sanitizePathSegment('')).toBe('untitled'));
  it('strips leading/trailing dots and dashes', () => expect(sanitizePathSegment('..test..')).toBe('test'));
});

describe('getPresetCoverageReport', () => {
  it('returns coverage data', () => {
    const r = getPresetCoverageReport();
    expect(r).toBeDefined();
    expect(r.required.length).toBeGreaterThan(0);
    expect(typeof r.complete).toBe('boolean');
  });
});

/* =====================================================================
   MODULE #4: normalization-helpers — C=59 aggregate
   Source: src/server/adapters/sales-channel/normalization-helpers.ts
   ===================================================================== */
import {
  asRecord, stringValue, intValue, centsValue, centsAlready,
  currencyValue, urlValue, deadlineValue, paymentStatusValue,
  uploadStatusValue, fulfillmentStatusValue, stableExternalOrderId,
  normalizeOrderPayload,
} from '@/server/adapters/sales-channel/normalization-helpers';

describe('asRecord', () => {
  it('converts object to record', () => expect(asRecord({ a: 1 })).toEqual({ a: 1 }));
  it('returns empty for null', () => expect(asRecord(null)).toEqual({}));
  it('returns empty for array', () => expect(asRecord([1, 2])).toEqual({}));
  it('returns empty for string', () => expect(asRecord('hello')).toEqual({}));
});

describe('stringValue', () => {
  it('returns first non-empty string', () => expect(stringValue('hello', 'world')).toBe('hello'));
  it('converts finite number to string', () => expect(stringValue(undefined, 42)).toBe('42'));
  it('returns undefined when no valid value', () => expect(stringValue(undefined, null, NaN)).toBeUndefined());
  it('returns undefined for Infinity', () => expect(stringValue(Infinity)).toBeUndefined());
});

describe('intValue', () => {
  it('rounds finite number', () => expect(intValue(10.7)).toBe(11));
  it('parses string with non-numeric chars', () => expect(intValue('$1,500')).toBe(1500));
  it('clamps negative values to 0', () => expect(intValue(-5)).toBe(0));
  it('returns fallback for unparseable', () => expect(intValue('abc', 99)).toBe(99));
});

describe('centsValue', () => {
  it('treats large integer as already cents', () => expect(centsValue(4900)).toBe(4900));
  it('converts small number to cents', () => expect(centsValue(49.99)).toBe(4999));
  it('parses string dollar amount to cents', () => expect(centsValue('$149.00')).toBe(14900));
  it('returns undefined for no values', () => expect(centsValue()).toBeUndefined());
});

describe('centsAlready', () => {
  it('returns rounded positive value', () => expect(centsAlready(4900.6)).toBe(4901));
  it('clamps negative to 0', () => expect(centsAlready(-100)).toBe(0));
  it('parses string numbers', () => expect(centsAlready('4900')).toBe(4900));
  it('returns undefined for undefined', () => expect(centsAlready(undefined)).toBeUndefined());
});

describe('currencyValue', () => {
  it('accepts valid 3-letter code', () => expect(currencyValue('eur')).toBe('EUR'));
  it('falls back to USD for invalid code', () => expect(currencyValue('ABCD')).toBe('USD'));
  it('falls back to USD for null', () => expect(currencyValue(null)).toBe('USD'));
});

describe('urlValue', () => {
  it('validates https URL', () => expect(urlValue('https://example.com/path')).toBe('https://example.com/path'));
  it('rejects non-http protocol', () => expect(urlValue('ftp://example.com')).toBeUndefined());
  it('rejects invalid URL', () => expect(urlValue('not-a-url')).toBeUndefined());
  it('returns undefined for null', () => expect(urlValue(null)).toBeUndefined());
});

describe('deadlineValue', () => {
  it('parses date string', () => expect(deadlineValue('2026-06-15')!).toMatch(/^2026-06-15/));
  it('rejects invalid date', () => expect(deadlineValue('not-a-date')).toBeUndefined());
  it('returns undefined for null', () => expect(deadlineValue(null)).toBeUndefined());
});

describe('paymentStatusValue', () => {
  it('maps PAID aliases', () => { expect(paymentStatusValue('paid')).toBe('PAID'); expect(paymentStatusValue('succeeded')).toBe('PAID'); });
  it('maps MANUAL_CONFIRMED', () => expect(paymentStatusValue('manual_confirmed')).toBe('MANUAL_CONFIRMED'));
  it('maps REFUNDED', () => expect(paymentStatusValue('refunded')).toBe('REFUNDED'));
  it('maps FAILED', () => expect(paymentStatusValue('failed')).toBe('FAILED'));
  it('maps UNPAID', () => expect(paymentStatusValue('unpaid')).toBe('UNPAID'));
  it('defaults to PENDING', () => expect(paymentStatusValue('unknown')).toBe('PENDING'));
  it('returns PENDING for null', () => expect(paymentStatusValue(null)).toBe('PENDING'));
});

describe('uploadStatusValue', () => {
  it('maps TOKEN_SENT', () => expect(uploadStatusValue('token_sent')).toBe('TOKEN_SENT'));
  it('maps PARTIAL', () => expect(uploadStatusValue('partial')).toBe('PARTIAL'));
  it('maps COMPLETE', () => expect(uploadStatusValue('complete')).toBe('COMPLETE'));
  it('maps FAILED', () => expect(uploadStatusValue('failed')).toBe('FAILED'));
  it('defaults to NOT_STARTED', () => expect(uploadStatusValue('unknown')).toBe('NOT_STARTED'));
});

describe('fulfillmentStatusValue', () => {
  it('maps IN_PROGRESS', () => expect(fulfillmentStatusValue('in_progress')).toBe('IN_PROGRESS'));
  it('maps NEEDS_REVIEW', () => expect(fulfillmentStatusValue('needs_review')).toBe('NEEDS_REVIEW'));
  it('maps APPROVED', () => expect(fulfillmentStatusValue('approved')).toBe('APPROVED'));
  it('maps DELIVERED', () => expect(fulfillmentStatusValue('delivered')).toBe('DELIVERED'));
  it('maps REVISION', () => expect(fulfillmentStatusValue('revision')).toBe('REVISION'));
  it('maps COMPLETE', () => expect(fulfillmentStatusValue('complete')).toBe('COMPLETE'));
  it('maps FAILED', () => expect(fulfillmentStatusValue('failed')).toBe('FAILED'));
  it('defaults to NOT_STARTED', () => expect(fulfillmentStatusValue('unknown')).toBe('NOT_STARTED'));
});

describe('stableExternalOrderId', () => {
  it('finds externalOrderId from payload', () => expect(stableExternalOrderId('Fiverr', { externalOrderId: 'ORD-1' })).toBe('ORD-1'));
  it('falls back to orderId', () => expect(stableExternalOrderId('Fiverr', { orderId: 'ORD-2' })).toBe('ORD-2'));
  it('generates fallback with channel key', () => expect(stableExternalOrderId('Direct', {})!).toMatch(/^direct-/));
});

/* =====================================================================
   MODULE #5: sales-channel-normalizer — C=49 aggregate
   Source: src/server/services/sales-channel-normalizer.ts
   ===================================================================== */
import {
  normalizeManualOrder, normalizeFiverrOrder, normalizeGumroadOrder,
  normalizeStripeCheckoutOrder, normalizeUpworkOrder, normalizeTaskrabbitOrder,
  normalizeGenericMarketplaceOrder, normalizeShopifyOrder,
} from '@/server/services/sales-channel-normalizer';

describe('sales-channel-normalizer', () => {
  it('normalizes manual order', () => {
    const o = normalizeManualOrder({ channelName: 'Direct', externalOrderId: 'ORD-1', buyerName: 'John', packagePurchased: 'Marketplace Listing 25', orderAmount: 149, paymentStatus: 'paid' });
    expect(o.channelName).toBe('Direct');
    expect(o.packageKey).toBe('MarketplaceListing25');
    expect(o.orderAmountCents).toBe(14900);
  });
  it('normalizes Fiverr order', () => {
    const o = normalizeFiverrOrder({ order_id: 'FIV-1', buyer_username: 'buyer1', gig_title: 'Quick Cleanup', price: 25 });
    expect(o.channelName).toBe('Fiverr');
    expect(o.packageKey).toBe('QuickCleanup10');
  });
  it('normalizes Gumroad order with price_cents', () => {
    expect(normalizeGumroadOrder({ sale_id: 'GUM-1', email: 'b@t.com', product_name: 'Marketplace Listing 25', price_cents: 4900 }).orderAmountCents).toBe(4900);
  });
  it('normalizes Gumroad order with price (not cents)', () => {
    expect(normalizeGumroadOrder({ sale_id: 'GUM-2', email: 'b@t.com', product_name: 'Quick Cleanup', price: 49 }).orderAmountCents).toBe(4900);
  });
  it('normalizes Stripe checkout order', () => {
    expect(normalizeStripeCheckoutOrder({ id: 'cs_test_1', customer_email: 'b@t.com', amount_total: 9900, client_reference_id: 'MarketplaceListing25' }).paymentStatus).toBe('PAID');
  });
  it('normalizes Upwork order', () => {
    expect(normalizeUpworkOrder({ contract_id: 'UPW-1', client_name: 'Client', amount: 500, currency: 'USD' }).channelName).toBe('Upwork');
  });
  it('normalizes Taskrabbit order', () => {
    expect(normalizeTaskrabbitOrder({ task_id: 'TR-1', client_name: 'Client', amount: 100 }).channelName).toBe('Taskrabbit');
  });
  it('normalizes generic marketplace order', () => {
    expect(normalizeGenericMarketplaceOrder('Etsy', { externalOrderId: 'ETS-1', buyerName: 'Buyer', amount: 75 }).channelName).toBe('Etsy');
  });
  it('normalizes Shopify order', () => {
    expect(normalizeShopifyOrder({ shopify_order_id: 'SHOP-1', storeName: 'Store', amount: 200 }).channelName).toBe('Shopify');
  });
});

/* =====================================================================
   MODULE #6: delivery-packaging-service — C=44 aggregate
   Source: src/server/services/delivery-packaging-service.ts
   ===================================================================== */
import { buildDeliveryArchivePlan } from '@/server/services/delivery-packaging-service';
import type { DeliveryArchiveInput } from '@/domain/delivery-packaging';

describe('delivery-packaging-service — branch coverage', () => {
  const base: DeliveryArchiveInput = {
    organizationId: 'org-1', jobId: 'job-1', jobNumber: 'LL-202601-00001', clientName: 'Test Client',
    selectedPresets: [],
    processedFiles: [{
      id: 'file-1', imageId: 'img-1', sourceImageName: 'photo.jpg', fileName: 'photo_processed.jpg',
      outputType: 'SQUARE_JPG', outputFormat: 'JPG', presetKey: 'AmazonMainImageDraft', platform: 'Amazon',
      storageKey: 'uploads/photo.jpg', mimeType: 'image/jpeg', width: 2000, height: 2000, sizeBytes: 500000,
      status: 'READY_FOR_REVIEW', approvedStatus: 'PENDING', backgroundType: 'WHITE',
      sellerReviewRequired: true, notes: '', folderPath: '',
    }],
  };

  it('builds delivery archive plan', () => {
    const p = buildDeliveryArchivePlan(base);
    expect(p.status).toBe('PLANNED');
    expect(p.files.length).toBeGreaterThanOrEqual(1);
  });
  it('marks failed files as failed', () => {
    const p = buildDeliveryArchivePlan({ ...base, processedFiles: [{ ...base.processedFiles[0], status: 'FAILED' as const }] });
    expect(p.files.filter((f: any) => f.kind === 'OUTPUT')[0].status).toBe('failed');
  });
  it('marks rejected files as excluded', () => {
    const p = buildDeliveryArchivePlan({ ...base, processedFiles: [{ ...base.processedFiles[0], status: 'APPROVED' as const, approvedStatus: 'REJECTED' as const }] });
    expect(p.files.filter((f: any) => f.kind === 'OUTPUT')[0].status).toBe('excluded');
  });
  it('respects includeManifest=false', () => {
    expect(buildDeliveryArchivePlan({ ...base, includeManifest: false }).files.filter((f: any) => f.kind === 'MANIFEST')).toHaveLength(0);
  });
  it('respects includeReadme=false', () => {
    expect(buildDeliveryArchivePlan({ ...base, includeReadme: false }).files.filter((f: any) => f.kind === 'README')).toHaveLength(0);
  });
  it('uses custom folderPath when provided', () => {
    const p = buildDeliveryArchivePlan({ ...base, processedFiles: [{ ...base.processedFiles[0], folderPath: 'Custom/Folder' }] });
    expect(p.files.filter((f: any) => f.kind === 'OUTPUT')[0].folderPath).toContain('Custom/Folder');
  });
});

/* =====================================================================
   MODULE #8: admin-job-queue-service — C=40 aggregate
   Source: src/server/services/admin-job-queue-service.ts
   ===================================================================== */
import { toJobQueueItem, filterJobQueue, sortJobQueue, summarizeAdminQueue, sanitizeJobAdminNote } from '@/server/services/admin-job-queue-service';
import type { JobQueueItem } from '@/schemas/job';

const baseJob: JobQueueItem = {
  id: 'job-1', jobNumber: 'LL-202601-00001', title: 'Test Job', clientName: 'Client A',
  packageKey: 'QuickCleanup10', sourceChannelName: 'Direct', status: 'WAITING_FOR_UPLOAD',
  priority: 'NORMAL', deadline: '2026-07-15T00:00:00.000Z', deadlineWarningLevel: 'NONE',
  imageQuantity: 10, queueRank: 100,
};

describe('toJobQueueItem', () => {
  it('transforms source to queue item', () => {
    const item = toJobQueueItem({ id: 'j-1', title: 'Job', status: 'WAITING_FOR_UPLOAD', createdAt: '2026-01-01', queuePosition: 5 });
    expect(item.id).toBe('j-1');
  });
});

describe('filterJobQueue — branch coverage', () => {
  const items: JobQueueItem[] = [
    { ...baseJob, id: 'a', status: 'WAITING_FOR_UPLOAD', priority: 'LOW', sourceChannelName: 'Direct', deadlineWarningLevel: 'NONE' },
    { ...baseJob, id: 'b', status: 'READY_FOR_DELIVERY', priority: 'HIGH', sourceChannelName: 'Fiverr', deadlineWarningLevel: 'OVERDUE' },
    { ...baseJob, id: 'c', status: 'PROCESSING', priority: 'URGENT', sourceChannelName: 'Gumroad', deadlineWarningLevel: 'DUE_SOON' },
  ];
  it('filters by status', () => expect(filterJobQueue(items, { status: ['WAITING_FOR_UPLOAD'] })).toHaveLength(1));
  it('filters by priority', () => expect(filterJobQueue(items, { priority: ['URGENT'] })).toHaveLength(1));
  it('filters by sourceChannelName', () => expect(filterJobQueue(items, { sourceChannelName: ['Fiverr'] })).toHaveLength(1));
  it('filters by deadlineWarningLevel', () => expect(filterJobQueue(items, { deadlineWarningLevel: ['OVERDUE'] })).toHaveLength(1));
  it('filters by search (title match)', () => expect(filterJobQueue(items, { search: 'Test' })).toHaveLength(3));
  it('filters by search (no match)', () => expect(filterJobQueue(items, { search: 'zzznotfound' })).toHaveLength(0));
  it('returns all with empty filters', () => expect(filterJobQueue(items, {})).toHaveLength(3));
});

describe('sortJobQueue — branch coverage', () => {
  const items: JobQueueItem[] = [
    { ...baseJob, id: 'a', deadline: '2026-01-01T00:00:00.000Z', priority: 'LOW', queueRank: 200 },
    { ...baseJob, id: 'b', deadline: '2026-12-31T00:00:00.000Z', priority: 'HIGH', queueRank: 50 },
    { ...baseJob, id: 'c', deadline: '2026-06-15T00:00:00.000Z', priority: 'NORMAL', queueRank: 100 },
  ];
  it('sorts by deadline ascending', () => { const s = sortJobQueue(items, 'deadline', 'asc'); expect(s[0].id).toBe('a'); expect(s[2].id).toBe('b'); });
  it('sorts by deadline descending', () => { const s = sortJobQueue(items, 'deadline', 'desc'); expect(s[0].id).toBe('b'); expect(s[2].id).toBe('a'); });
  it('sorts by priority ascending (alphabetical)', () => { const s = sortJobQueue(items, 'priority', 'asc'); expect(s[0].priority).toBe('HIGH'); expect(s[2].priority).toBe('NORMAL'); });
  it('sorts by status', () => { const s = sortJobQueue(items, 'status'); expect(s).toHaveLength(3); });
});

describe('summarizeAdminQueue', () => {
  const items: JobQueueItem[] = [
    { ...baseJob, id: 'a', status: 'WAITING_FOR_UPLOAD', deadlineWarningLevel: 'OVERDUE' },
    { ...baseJob, id: 'b', status: 'READY_FOR_DELIVERY', deadlineWarningLevel: 'DUE_SOON' },
    { ...baseJob, id: 'c', status: 'PROCESSING', deadlineWarningLevel: 'NONE' },
    { ...baseJob, id: 'd', status: 'FLAGGED_OUTPUTS', deadlineWarningLevel: 'UPCOMING' },
  ];
  it('summarizes correctly', () => {
    const s = summarizeAdminQueue(items);
    expect(s.total).toBe(4);
    expect(s.overdue).toBe(1);
    expect(s.dueSoon).toBe(1);
    expect(s.waitingForUpload).toBe(1);
    expect(s.waitingForReview).toBe(1);
    expect(s.readyForDelivery).toBe(1);
  });
  it('handles empty', () => { const s = summarizeAdminQueue([]); expect(s.total).toBe(0); });
});

describe('sanitizeJobAdminNote', () => {
  it('returns null for null', () => expect(sanitizeJobAdminNote(null)).toBeNull());
  it('truncates long notes', () => {
    const r = sanitizeJobAdminNote('x'.repeat(6000));
    expect(r!.length).toBeLessThanOrEqual(5000);
  });
});

/* =====================================================================
   MODULE #9: job-queue domain — C aggregate
   Source: src/domain/job-queue.ts
   ===================================================================== */
import {
  normalizeJobPriority, getDeadlineWarningLevel, calculateQueueRank,
  buildJobNumber, isActiveQueueStatus, assertKnownJobStatus, safeAdminQueueNote,
} from '@/domain/job-queue';

describe('job-queue domain', () => {
  describe('normalizeJobPriority', () => {
    it('defaults to NORMAL', () => expect(normalizeJobPriority(null)).toBe('NORMAL'));
    it('returns valid priority', () => expect(normalizeJobPriority('HIGH')).toBe('HIGH'));
    it('handles lowercase', () => expect(normalizeJobPriority('urgent')).toBe('URGENT'));
    it('falls back to NORMAL for unknown', () => expect(normalizeJobPriority('SUPER')).toBe('NORMAL'));
  });

  describe('getDeadlineWarningLevel', () => {
    it('returns NONE for terminal status', () => expect(getDeadlineWarningLevel({ deadline: new Date('2020-01-01'), status: 'COMPLETED' })).toBe('NONE'));
    it('returns NONE when no deadline', () => expect(getDeadlineWarningLevel({})).toBe('NONE'));
    it('returns OVERDUE when past deadline', () => expect(getDeadlineWarningLevel({ deadline: new Date('2020-01-01'), now: new Date('2026-01-01') })).toBe('OVERDUE'));
    it('returns DUE_SOON within 24h', () => {
      const now = new Date('2026-01-01T00:00:00Z');
      expect(getDeadlineWarningLevel({ deadline: new Date('2026-01-01T12:00:00Z'), now })).toBe('DUE_SOON');
    });
    it('returns UPCOMING within 72h', () => {
      const now = new Date('2026-01-01T00:00:00Z');
      expect(getDeadlineWarningLevel({ deadline: new Date('2026-01-02T12:00:00Z'), now })).toBe('UPCOMING');
    });
    it('returns NONE more than 72h away', () => {
      const now = new Date('2026-01-01T00:00:00Z');
      expect(getDeadlineWarningLevel({ deadline: new Date('2026-01-10T00:00:00Z'), now })).toBe('NONE');
    });
  });

  describe('calculateQueueRank', () => {
    it('uses queuePosition when > 0', () => expect(calculateQueueRank({ queuePosition: 5 })).toBe(5));
    it('active status gets lower number', () => {
      const a = calculateQueueRank({ priority: 'NORMAL', deadline: new Date('2026-07-01'), createdAt: new Date('2026-01-01'), status: 'WAITING_FOR_UPLOAD' });
      const i = calculateQueueRank({ priority: 'NORMAL', deadline: new Date('2026-07-01'), createdAt: new Date('2026-01-01'), status: 'DELIVERED' });
      expect(a).toBeLessThan(i);
    });
    it('high priority lowers rank number', () => {
      const h = calculateQueueRank({ priority: 'HIGH', deadline: new Date('2026-07-01'), createdAt: new Date('2026-01-01'), status: 'WAITING_FOR_UPLOAD' });
      const l = calculateQueueRank({ priority: 'LOW', deadline: new Date('2026-07-01'), createdAt: new Date('2026-01-01'), status: 'WAITING_FOR_UPLOAD' });
      expect(h).toBeLessThan(l);
    });
  });

  describe('buildJobNumber', () => {
    it('builds formatted job number', () => expect(buildJobNumber({ prefix: 'LL', sequence: 1, createdAt: '2026-01-15' })).toMatch(/^LL-202601-00001$/));
    it('uses default prefix', () => expect(buildJobNumber({ sequence: 123 })).toMatch(/^LL-/));
  });

  describe('isActiveQueueStatus', () => {
    it('returns true for active', () => expect(isActiveQueueStatus('PROCESSING')).toBe(true));
    it('returns false for terminal', () => expect(isActiveQueueStatus('DELIVERED')).toBe(false));
  });

  describe('assertKnownJobStatus', () => {
    it('passes for known status', () => expect(() => assertKnownJobStatus('DRAFT')).not.toThrow());
    it('throws for unknown', () => expect(() => assertKnownJobStatus('BOGUS')).toThrow('Unknown job status'));
  });

  describe('safeAdminQueueNote', () => {
    it('strips null bytes but preserves surrounding text', () => {
      expect(safeAdminQueueNote('hello\x00world')).toBe('helloworld');
    });
  });
});

/* =====================================================================
   MODULE #10: sales-channel-normalization domain — C aggregate
   Source: src/domain/sales-channel-normalization.ts
   ===================================================================== */
import {
  normalizeChannelToken, toCanonicalSalesChannelKey, adapterKeyForSalesChannel,
  getSalesChannelDefinition, toCanonicalPackageKey, buildExternalOrderDedupeKey,
  requiresManualMarketplaceWorkflow, safeMarketplaceAutomationNote,
} from '@/domain/sales-channel-normalization';

describe('sales-channel-normalization domain', () => {
  describe('normalizeChannelToken', () => {
    it('lowercases and replaces', () => expect(normalizeChannelToken('Facebook & Co')).toBe('facebook-and-co'));
    it('strips leading/trailing hyphens', () => expect(normalizeChannelToken('--hello--')).toBe('hello'));
  });

  describe('toCanonicalSalesChannelKey', () => {
    it('matches exact key', () => expect(toCanonicalSalesChannelKey('Fiverr')).toBe('Fiverr'));
    it('matches case-insensitive', () => expect(toCanonicalSalesChannelKey('fiverr')).toBe('Fiverr'));
    it('matches alias', () => expect(toCanonicalSalesChannelKey('freelancer')).toBe('Freelancer'));
    it('uses fallback for non-string', () => expect(toCanonicalSalesChannelKey(123)).toBe('Direct'));
    it('uses fallback for empty', () => expect(toCanonicalSalesChannelKey('')).toBe('Direct'));
  });

  describe('adapterKeyForSalesChannel', () => {
    it('maps Fiverr to fiverr adapter key', () => expect(adapterKeyForSalesChannel('Fiverr')).toBe('fiverr'));
    it('maps Etsy to etsy adapter key', () => expect(adapterKeyForSalesChannel('Etsy')).toBe('etsy'));
  });

  describe('getSalesChannelDefinition', () => {
    it('returns definition for known channel', () => {
      expect(getSalesChannelDefinition('Fiverr')).toBeDefined();
    });
    // 'Bogus' falls back to 'Direct' via toCanonicalSalesChannelKey
    it('returns definition for unknown via fallback', () => {
      const def = getSalesChannelDefinition('Bogus');
      expect(def).toBeDefined();
      expect(def!.key).toBe('Direct');
    });
  });

  describe('toCanonicalPackageKey', () => {
    it('matches exact key', () => expect(toCanonicalPackageKey('QuickCleanup10')).toBe('QuickCleanup10'));
    it('matches alias', () => expect(toCanonicalPackageKey('quick cleanup')).toBe('QuickCleanup10'));
    it('uses fallback for non-string', () => expect(toCanonicalPackageKey(null)).toBe('QuickCleanup10'));
  });

  describe('buildExternalOrderDedupeKey', () => {
    it('builds dedupe key with org', () => expect(buildExternalOrderDedupeKey({ organizationId: 'org-1', channelName: 'Fiverr', externalOrderId: 'ORD-1' })).toBe('org-1:fiverr:ord-1'));
    it('builds dedupe key without org', () => expect(buildExternalOrderDedupeKey({ channelName: 'Direct', externalOrderId: 'ORD-1' })).toBe('direct:ord-1'));
  });

  describe('requiresManualMarketplaceWorkflow', () => {
    // Etsy has defaultMode 'API' in DEFAULT_SALES_CHANNELS, and marketplaceSafety doesn't match /manual|do not scrape|approved/i
    it('returns false for Etsy (API default mode)', () => expect(requiresManualMarketplaceWorkflow('Etsy')).toBe(false));
    // Fiverr has defaultMode 'MANUAL'
    it('returns true for Fiverr (MANUAL default mode)', () => expect(requiresManualMarketplaceWorkflow('Fiverr')).toBe(true));
    it('returns true for unknown channel', () => expect(requiresManualMarketplaceWorkflow('Nonexistent')).toBe(true));
  });

  describe('safeMarketplaceAutomationNote', () => {
    // Fiverr has defaultMode 'MANUAL' → gets manual workflow note
    it('returns manual workflow note for manual channels', () => {
      expect(safeMarketplaceAutomationNote('Fiverr')).toContain('Manual or approved integration');
    });
    // Etsy has defaultMode 'API' → gets API safety note
    it('returns API note for API channels', () => {
      expect(safeMarketplaceAutomationNote('Etsy')).toContain('official APIs');
    });
  });
});
