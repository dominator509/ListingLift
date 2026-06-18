export const CLIENT_DASHBOARD_SECTIONS = [
  'OVERVIEW',
  'UPLOADS',
  'ACTIVE_JOBS',
  'COMPLETED_JOBS',
  'PREVIEWS',
  'DOWNLOADS',
  'REVISIONS',
  'BILLING',
  'UPGRADE',
] as const;

export type ClientDashboardSection = (typeof CLIENT_DASHBOARD_SECTIONS)[number];

export const CLIENT_DASHBOARD_JOB_STATUS_GROUPS = {
  active: ['WAITING_FOR_UPLOAD', 'UPLOAD_RECEIVED', 'PROCESSING_QUEUED', 'PROCESSING', 'WAITING_FOR_REVIEW', 'FLAGGED_OUTPUTS', 'REVISION_REQUESTED', 'REPROCESSING', 'READY_FOR_DELIVERY'],
  completed: ['DELIVERED', 'COMPLETED'],
  blocked: ['FLAGGED_OUTPUTS', 'FAILED', 'CANCELLED'],
} as const;

export type ClientDashboardJobStatusGroup = keyof typeof CLIENT_DASHBOARD_JOB_STATUS_GROUPS;

export const CLIENT_VISIBLE_PREVIEW_STATUSES = ['CLIENT_VISIBLE', 'APPROVED'] as const;
export const CLIENT_HIDDEN_OUTPUT_STATUSES = ['PENDING', 'FLAGGED', 'FAILED', 'REJECTED', 'ADMIN_ONLY'] as const;

export const CLIENT_DOWNLOAD_REQUIREMENTS = [
  'active_session',
  'client_scope_match',
  'delivery_link_valid',
  'delivery_archive_approved',
  'job_approved',
  'no_blocking_quality_flags',
  'download_limit_not_exceeded',
] as const;

export const CLIENT_DASHBOARD_SAFE_COPY = {
  previewNotice: 'Preview images are provided for review. Final downloads appear only after admin approval and delivery release.',
  marketplaceNotice: 'Files are formatted as platform-ready drafts. Seller review against current marketplace guidelines is recommended before publishing.',
  upgradeNotice: 'Upgrade suggestions are optional recommendations based on the current image workflow and do not guarantee marketplace approval, ranking, sales, conversion, or ad performance.',
  revisionNotice: 'Revision requests are reviewed against the package allowance and project scope before reprocessing.',
} as const;

export function normalizeClientDashboardStatus(status: string) {
  return status.trim().toUpperCase().replaceAll(' ', '_').replaceAll('-', '_');
}

export function isClientVisiblePreview(input: { visibility?: string | null; reviewStatus?: string | null; flagged?: boolean | null; failed?: boolean | null }) {
  if (input.flagged || input.failed) return false;
  const visibility = normalizeClientDashboardStatus(input.visibility ?? '');
  const reviewStatus = normalizeClientDashboardStatus(input.reviewStatus ?? '');
  return visibility === 'CLIENT_VISIBLE' || reviewStatus === 'APPROVED';
}

export function getClientDashboardJobGroup(status: string): ClientDashboardJobStatusGroup | 'unknown' {
  const normalized = normalizeClientDashboardStatus(status);
  if ((CLIENT_DASHBOARD_JOB_STATUS_GROUPS.completed as readonly string[]).includes(normalized)) return 'completed';
  if ((CLIENT_DASHBOARD_JOB_STATUS_GROUPS.blocked as readonly string[]).includes(normalized)) return 'blocked';
  if ((CLIENT_DASHBOARD_JOB_STATUS_GROUPS.active as readonly string[]).includes(normalized)) return 'active';
  return 'unknown';
}

export function clientDashboardSafeCopyContainsGuarantee(copy: string) {
  const unsafeTerms = ['guarantee approval', 'guaranteed approval', 'guarantee sales', 'guaranteed sales', 'guarantee ranking', 'guaranteed ranking', 'conversion increase guaranteed', 'ad performance guaranteed'];
  const normalized = copy.toLowerCase();
  return unsafeTerms.some((term) => normalized.includes(term));
}
