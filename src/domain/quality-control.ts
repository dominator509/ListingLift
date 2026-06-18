export const QUALITY_FLAG_SEVERITIES = ['INFO', 'WARNING', 'BLOCKER'] as const;
export type QualityFlagSeverity = (typeof QUALITY_FLAG_SEVERITIES)[number];

export const QUALITY_REVIEW_STATUSES = ['PENDING_REVIEW', 'PASSED', 'FLAGGED', 'FAILED', 'NEEDS_MANUAL_REPLACEMENT', 'RESOLVED', 'DISMISSED'] as const;
export type QualityReviewStatus = (typeof QUALITY_REVIEW_STATUSES)[number];

export const QUALITY_FLAG_STATUSES = ['OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED'] as const;
export type QualityFlagStatus = (typeof QUALITY_FLAG_STATUSES)[number];

export const QUALITY_FLAG_CATEGORIES = ['PRODUCT_ACCURACY', 'BACKGROUND', 'CROP', 'LIGHTING', 'FOCUS', 'MASK', 'DUPLICATE', 'PRESET', 'NAMING', 'FOLDERING', 'DELIVERY', 'MANUAL_REVIEW'] as const;
export type QualityFlagCategory = (typeof QUALITY_FLAG_CATEGORIES)[number];

export type QualityFlagDefinition = {
  key: string;
  label: string;
  category: QualityFlagCategory;
  severity: QualityFlagSeverity;
  blocksDelivery: boolean;
  suggestedAction: string;
};

export const QUALITY_FLAG_DEFINITIONS = [
  { key: 'edge_quality_issue', label: 'Edge quality issue', category: 'MASK', severity: 'WARNING', blocksDelivery: true, suggestedAction: 'Inspect product edges and rerun background removal or request manual cleanup.' },
  { key: 'product_accuracy_issue', label: 'Product accuracy issue', category: 'PRODUCT_ACCURACY', severity: 'BLOCKER', blocksDelivery: true, suggestedAction: 'Confirm the output preserves the full product shape, color, and important details.' },
  { key: 'weird_cutoff', label: 'Weird cutoff', category: 'CROP', severity: 'BLOCKER', blocksDelivery: true, suggestedAction: 'Reject the output or reprocess with a safer crop/mask.' },
  { key: 'missing_part', label: 'Missing product part', category: 'PRODUCT_ACCURACY', severity: 'BLOCKER', blocksDelivery: true, suggestedAction: 'Reject the output and reprocess from the original image or upload a manual replacement.' },
  { key: 'lighting_issue', label: 'Lighting issue', category: 'LIGHTING', severity: 'WARNING', blocksDelivery: false, suggestedAction: 'Flag for reviewer judgment or manual enhancement if the product looks inaccurate.' },
  { key: 'blurry_photo', label: 'Blurry photo', category: 'FOCUS', severity: 'WARNING', blocksDelivery: false, suggestedAction: 'Request a better source image if blur prevents professional output.' },
  { key: 'wrong_crop', label: 'Wrong crop', category: 'CROP', severity: 'WARNING', blocksDelivery: true, suggestedAction: 'Regenerate the preset output with correct framing and safe margin.' },
  { key: 'failed_mask', label: 'Failed mask', category: 'MASK', severity: 'BLOCKER', blocksDelivery: true, suggestedAction: 'Rerun provider, use another provider, or upload a manually edited replacement.' },
  { key: 'duplicate_file', label: 'Duplicate file', category: 'DUPLICATE', severity: 'INFO', blocksDelivery: false, suggestedAction: 'Remove duplicate output from final archive unless intentionally included.' },
  { key: 'wrong_background', label: 'Wrong background', category: 'BACKGROUND', severity: 'WARNING', blocksDelivery: true, suggestedAction: 'Regenerate with the requested white, transparent, brand, or custom background.' },
  { key: 'preset_accuracy_issue', label: 'Preset accuracy issue', category: 'PRESET', severity: 'WARNING', blocksDelivery: true, suggestedAction: 'Verify dimensions, aspect ratio, format, margin, and platform folder mapping.' },
  { key: 'file_naming_issue', label: 'File naming issue', category: 'NAMING', severity: 'WARNING', blocksDelivery: false, suggestedAction: 'Regenerate safe predictable file names before ZIP creation.' },
  { key: 'folder_organization_issue', label: 'Folder organization issue', category: 'FOLDERING', severity: 'WARNING', blocksDelivery: false, suggestedAction: 'Regenerate delivery folder plan from selected platform presets.' },
  { key: 'client_instruction_mismatch', label: 'Client instruction mismatch', category: 'MANUAL_REVIEW', severity: 'BLOCKER', blocksDelivery: true, suggestedAction: 'Compare against client intake notes and correct before client preview or delivery.' },
  { key: 'marketplace_claim_risk', label: 'Marketplace claim risk', category: 'DELIVERY', severity: 'BLOCKER', blocksDelivery: true, suggestedAction: 'Replace unsafe guarantee language with platform-ready draft and seller-review wording.' },
] as const satisfies readonly QualityFlagDefinition[];

export type QualityFlagKey = (typeof QUALITY_FLAG_DEFINITIONS)[number]['key'];
export const QUALITY_FLAG_KEYS = QUALITY_FLAG_DEFINITIONS.map((flag) => flag.key) as [QualityFlagKey, ...QualityFlagKey[]];

export type QualityOutputInput = {
  id: string;
  outputFileName: string;
  outputType?: string | null;
  presetKey?: string | null;
  platform?: string | null;
  width?: number | null;
  height?: number | null;
  qualityScore?: number | null;
  status?: string | null;
  approvedStatus?: string | null;
  flags?: string[] | null;
  adminNotes?: string | null;
};

export type QualityReviewDecision = {
  outputId: string;
  status: QualityReviewStatus;
  score: number;
  flags: Array<QualityFlagDefinition & { status: QualityFlagStatus }>;
  blockerCount: number;
  warningCount: number;
  infoCount: number;
  finalDeliveryBlocked: boolean;
  manualFallbackRequired: boolean;
  manualReplacementRequired: boolean;
  recommendedAction: string;
  safeLanguage: string;
};

const definitionByKey = new Map<string, QualityFlagDefinition>(QUALITY_FLAG_DEFINITIONS.map((flag) => [flag.key, flag]));

export function getQualityFlagDefinition(key: string): QualityFlagDefinition {
  return definitionByKey.get(key) ?? {
    key,
    label: key.replaceAll('_', ' '),
    category: 'MANUAL_REVIEW',
    severity: 'WARNING',
    blocksDelivery: true,
    suggestedAction: 'Reviewer-created flag requires explicit resolution before final delivery.',
  };
}

export function normalizeQualityFlagKeys(keys: readonly string[] = []) {
  return [...new Set(keys.map((key) => key.trim().toLowerCase()).filter(Boolean))];
}

export function deriveQualityReviewStatus(input: { status?: string | null; approvedStatus?: string | null; flags?: readonly string[] | null; qualityScore?: number | null }): QualityReviewStatus {
  const status = input.status?.toUpperCase();
  const approved = input.approvedStatus?.toUpperCase();
  const flags = normalizeQualityFlagKeys(input.flags ?? []);
  if (status === 'FAILED') return 'FAILED';
  if (flags.some((flag) => getQualityFlagDefinition(flag).severity === 'BLOCKER')) return 'FAILED';
  if (flags.length > 0) return 'FLAGGED';
  if ((input.qualityScore ?? 100) < 65) return 'FLAGGED';
  if (approved === 'APPROVED' || status === 'APPROVED') return 'PASSED';
  return 'PENDING_REVIEW';
}

export function calculateQualityScore(input: { qualityScore?: number | null; flags?: readonly string[] | null }) {
  const base = input.qualityScore ?? 100;
  const penalties = normalizeQualityFlagKeys(input.flags ?? []).reduce((score, flagKey) => {
    const severity = getQualityFlagDefinition(flagKey).severity;
    if (severity === 'BLOCKER') return score + 35;
    if (severity === 'WARNING') return score + 15;
    return score + 5;
  }, 0);
  return Math.max(0, Math.min(100, base - penalties));
}

export function evaluateOutputQuality(output: QualityOutputInput): QualityReviewDecision {
  const flagKeys = normalizeQualityFlagKeys(output.flags ?? []);
  const flags = flagKeys.map((key) => ({ ...getQualityFlagDefinition(key), status: 'OPEN' as const }));
  const blockerCount = flags.filter((flag) => flag.severity === 'BLOCKER' || flag.blocksDelivery).length;
  const warningCount = flags.filter((flag) => flag.severity === 'WARNING').length;
  const infoCount = flags.filter((flag) => flag.severity === 'INFO').length;
  const score = calculateQualityScore({ qualityScore: output.qualityScore, flags: flagKeys });
  const status = deriveQualityReviewStatus({ status: output.status, approvedStatus: output.approvedStatus, flags: flagKeys, qualityScore: score });
  const manualReplacementRequired = flags.some((flag) => ['failed_mask', 'missing_part', 'weird_cutoff', 'product_accuracy_issue'].includes(flag.key));
  const finalDeliveryBlocked = status !== 'PASSED' || blockerCount > 0;
  return {
    outputId: output.id,
    status,
    score,
    flags,
    blockerCount,
    warningCount,
    infoCount,
    finalDeliveryBlocked,
    manualFallbackRequired: finalDeliveryBlocked,
    manualReplacementRequired,
    recommendedAction: finalDeliveryBlocked ? 'Resolve flags, reprocess, or upload a manual replacement before final delivery.' : 'Output can remain in admin approval flow; final delivery is still separately gated.',
    safeLanguage: 'Quality review result only. Platform-ready draft; seller review recommended. No marketplace approval, ranking, conversion, sales, or ad-performance guarantee.',
  };
}

export function summarizeQualityReviews(reviews: QualityReviewDecision[]) {
  return {
    total: reviews.length,
    passed: reviews.filter((review) => review.status === 'PASSED').length,
    pending: reviews.filter((review) => review.status === 'PENDING_REVIEW').length,
    flagged: reviews.filter((review) => review.status === 'FLAGGED').length,
    failed: reviews.filter((review) => review.status === 'FAILED').length,
    blockers: reviews.reduce((sum, review) => sum + review.blockerCount, 0),
    warnings: reviews.reduce((sum, review) => sum + review.warningCount, 0),
    deliveryBlocked: reviews.some((review) => review.finalDeliveryBlocked),
    manualFallbackRequired: reviews.some((review) => review.manualFallbackRequired),
  };
}

export function canMarkOutputQualityPassed(review: QualityReviewDecision) {
  return review.blockerCount === 0 && review.status !== 'FAILED' && !review.manualReplacementRequired;
}

export function buildQualityChecklist() {
  return QUALITY_FLAG_DEFINITIONS.map((flag, index) => ({
    id: flag.key,
    position: index + 1,
    label: flag.label,
    category: flag.category,
    severity: flag.severity,
    blocksDelivery: flag.blocksDelivery,
    suggestedAction: flag.suggestedAction,
  }));
}
