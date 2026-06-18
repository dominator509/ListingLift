export const PREVIEW_GALLERY_STATUSES = ['DRAFT', 'READY_FOR_REVIEW', 'CLIENT_VISIBLE', 'ARCHIVED'] as const;
export type PreviewGalleryStatus = (typeof PREVIEW_GALLERY_STATUSES)[number];

export const PREVIEW_ITEM_VISIBILITIES = ['ADMIN_ONLY', 'CLIENT_VISIBLE', 'HIDDEN'] as const;
export type PreviewItemVisibility = (typeof PREVIEW_ITEM_VISIBILITIES)[number];

export const PREVIEW_REVIEW_STATUSES = ['READY_FOR_REVIEW', 'APPROVED', 'FLAGGED', 'FAILED', 'REJECTED'] as const;
export type PreviewReviewStatus = (typeof PREVIEW_REVIEW_STATUSES)[number];

export const PREVIEW_FILTER_STATUSES = ['ready_for_review', 'approved', 'flagged', 'failed', 'rejected'] as const;
export type PreviewFilterStatus = (typeof PREVIEW_FILTER_STATUSES)[number];

export const PREVIEW_SAFE_LANGUAGE = [
  'Preview images are working review drafts until final admin delivery approval is complete.',
  'Client-visible previews do not guarantee marketplace approval, ranking, sales, conversion lift, ad performance, or listing approval.',
  'Seller review is recommended before publishing any platform-ready draft.',
] as const;

export type PreviewProcessedFileInput = {
  id: string;
  imageId?: string | null;
  originalName?: string | null;
  originalStorageKey?: string | null;
  outputFileName: string;
  previewUrl?: string | null;
  thumbnailUrl?: string | null;
  storageKey?: string | null;
  outputType: string;
  outputFormat?: string | null;
  presetKey?: string | null;
  platform?: string | null;
  width?: number | null;
  height?: number | null;
  qualityScore?: number | null;
  status: string;
  approvedStatus?: string | null;
  qualityFlags?: string[] | null;
  adminNotes?: string | null;
  clientNotes?: string | null;
};

export type PreviewFilterInput = {
  outputTypes?: string[];
  presetKeys?: string[];
  platforms?: string[];
  reviewStatuses?: PreviewFilterStatus[];
  approvedOnly?: boolean;
  includeFlagged?: boolean;
  includeFailed?: boolean;
  search?: string;
};

export type PreviewGalleryItem = PreviewProcessedFileInput & {
  reviewStatus: PreviewReviewStatus;
  visibility: PreviewItemVisibility;
  clientVisible: boolean;
  needsAdminReview: boolean;
  flags: string[];
  safeClaim: string;
};

export type BeforeAfterPair = {
  imageId: string;
  originalName: string;
  originalStorageKey?: string | null;
  outputs: PreviewGalleryItem[];
  bestOutput?: PreviewGalleryItem;
};

export type PreviewGallerySummary = {
  total: number;
  readyForReview: number;
  approved: number;
  flagged: number;
  failed: number;
  rejected: number;
  clientVisible: number;
  beforeAfterPairs: number;
};

export function derivePreviewReviewStatus(file: Pick<PreviewProcessedFileInput, 'status' | 'approvedStatus' | 'qualityFlags'>): PreviewReviewStatus {
  const normalizedStatus = file.status.toUpperCase();
  const normalizedApproval = file.approvedStatus?.toUpperCase();
  const flags = file.qualityFlags ?? [];
  if (normalizedStatus === 'FAILED') return 'FAILED';
  if (normalizedStatus === 'REJECTED' || normalizedApproval === 'REJECTED') return 'REJECTED';
  if (normalizedStatus === 'FLAGGED' || flags.length > 0) return 'FLAGGED';
  if (normalizedStatus === 'APPROVED' || normalizedApproval === 'APPROVED') return 'APPROVED';
  return 'READY_FOR_REVIEW';
}

export function canClientViewPreview(input: { reviewStatus: PreviewReviewStatus; approvedStatus?: string | null; clientPreviewEnabled?: boolean }) {
  return Boolean(input.clientPreviewEnabled && input.approvedStatus?.toUpperCase() === 'APPROVED' && input.reviewStatus === 'APPROVED');
}

export function buildPreviewGalleryItem(file: PreviewProcessedFileInput, options: { clientPreviewEnabled?: boolean } = {}): PreviewGalleryItem {
  const reviewStatus = derivePreviewReviewStatus(file);
  const clientVisible = canClientViewPreview({ reviewStatus, approvedStatus: file.approvedStatus, clientPreviewEnabled: options.clientPreviewEnabled });
  const flags = [...(file.qualityFlags ?? [])];
  if (reviewStatus === 'FAILED' && !flags.includes('processing_failed')) flags.push('processing_failed');
  if (reviewStatus === 'FLAGGED' && !flags.length) flags.push('needs_quality_review');
  return {
    ...file,
    reviewStatus,
    visibility: clientVisible ? 'CLIENT_VISIBLE' : 'ADMIN_ONLY',
    clientVisible,
    needsAdminReview: ['READY_FOR_REVIEW', 'FLAGGED', 'FAILED'].includes(reviewStatus),
    flags,
    safeClaim: 'Preview only. Platform-ready draft; seller review recommended before publishing.',
  };
}

export function filterPreviewItems(items: PreviewGalleryItem[], filters: PreviewFilterInput = {}) {
  const search = filters.search?.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.outputTypes?.length && !filters.outputTypes.includes(item.outputType)) return false;
    if (filters.presetKeys?.length && (!item.presetKey || !filters.presetKeys.includes(item.presetKey))) return false;
    if (filters.platforms?.length && (!item.platform || !filters.platforms.includes(item.platform))) return false;
    if (filters.reviewStatuses?.length && !filters.reviewStatuses.includes(item.reviewStatus.toLowerCase() as PreviewFilterStatus)) return false;
    if (filters.approvedOnly && item.reviewStatus !== 'APPROVED') return false;
    if (filters.includeFlagged === false && item.reviewStatus === 'FLAGGED') return false;
    if (filters.includeFailed === false && item.reviewStatus === 'FAILED') return false;
    if (search) {
      const haystack = [item.outputFileName, item.originalName, item.presetKey, item.platform, item.outputType].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export function groupBeforeAfterPairs(items: PreviewGalleryItem[]): BeforeAfterPair[] {
  const groups = new Map<string, PreviewGalleryItem[]>();
  for (const item of items) {
    const key = item.imageId ?? `processed:${item.id}`;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.entries()].map(([imageId, outputs]) => {
    const approved = outputs.find((output) => output.reviewStatus === 'APPROVED');
    const ready = outputs.find((output) => output.reviewStatus === 'READY_FOR_REVIEW');
    return {
      imageId,
      originalName: outputs[0]?.originalName ?? 'Original upload',
      originalStorageKey: outputs[0]?.originalStorageKey,
      outputs,
      bestOutput: approved ?? ready ?? outputs[0],
    };
  });
}

export function summarizePreviewGallery(items: PreviewGalleryItem[]): PreviewGallerySummary {
  return {
    total: items.length,
    readyForReview: items.filter((item) => item.reviewStatus === 'READY_FOR_REVIEW').length,
    approved: items.filter((item) => item.reviewStatus === 'APPROVED').length,
    flagged: items.filter((item) => item.reviewStatus === 'FLAGGED').length,
    failed: items.filter((item) => item.reviewStatus === 'FAILED').length,
    rejected: items.filter((item) => item.reviewStatus === 'REJECTED').length,
    clientVisible: items.filter((item) => item.clientVisible).length,
    beforeAfterPairs: groupBeforeAfterPairs(items).length,
  };
}

export function buildBulkPreviewApprovalDraft(items: PreviewGalleryItem[], selectedIds: string[], actorUserId?: string | null) {
  const selected = items.filter((item) => selectedIds.includes(item.id));
  const approvable = selected.filter((item) => item.reviewStatus === 'READY_FOR_REVIEW' && item.approvedStatus !== 'APPROVED');
  const skipped = selected.filter((item) => !approvable.some((candidate) => candidate.id === item.id));
  return {
    actorUserId: actorUserId ?? null,
    selectedCount: selected.length,
    approvableCount: approvable.length,
    skippedCount: skipped.length,
    approvableIds: approvable.map((item) => item.id),
    skipped: skipped.map((item) => ({ id: item.id, reason: `Not approvable from ${item.reviewStatus}` })),
    auditEvent: 'preview.bulk_approval_requested',
    warning: 'Bulk preview approval is not final delivery approval. Client downloads remain gated by delivery workflow approval.',
  };
}
