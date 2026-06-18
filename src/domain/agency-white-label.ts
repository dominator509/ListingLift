export const AGENCY_WHITE_LABEL_PHASE = 'phase-35-agency-white-label-mode' as const;

export const AGENCY_WHITE_LABEL_SECTIONS = [
  'DASHBOARD',
  'WORKSPACES',
  'WHITE_LABEL_SETTINGS',
  'BRANDED_DELIVERY',
  'BRANDED_REPORTS',
  'BILLING',
  'TEAM',
  'BULK_QUEUE',
  'VOLUME_PRICING',
] as const;

export type AgencyWhiteLabelSection = (typeof AGENCY_WHITE_LABEL_SECTIONS)[number];

export const AGENCY_WHITE_LABEL_EVENT_TYPES = [
  'VIEW',
  'OPEN_WORKSPACE',
  'CREATE_WORKSPACE_DRAFT',
  'UPDATE_BRAND_SETTINGS_DRAFT',
  'PREVIEW_BRANDED_DELIVERY',
  'PREVIEW_BRANDED_REPORT',
  'PLAN_BULK_QUEUE',
  'QUOTE_VOLUME_PRICING',
  'INVITE_TEAM_MEMBER_DRAFT',
  'REQUEST_MANUAL_REVIEW',
] as const;

export type AgencyWhiteLabelEventType = (typeof AGENCY_WHITE_LABEL_EVENT_TYPES)[number];

export const AGENCY_WORKSPACE_STATUSES = ['LEAD', 'ACTIVE', 'PAUSED', 'ARCHIVED'] as const;
export type AgencyWorkspaceStatus = (typeof AGENCY_WORKSPACE_STATUSES)[number];

export const AGENCY_QUEUE_STATUSES = [
  'PLANNED',
  'WAITING_FOR_UPLOADS',
  'READY_FOR_PROCESSING',
  'PROCESSING',
  'WAITING_FOR_REVIEW',
  'FLAGGED',
  'READY_FOR_DELIVERY',
  'DELIVERED',
  'BLOCKED',
] as const;

export type AgencyQueueStatus = (typeof AGENCY_QUEUE_STATUSES)[number];

export const AGENCY_TEAM_ROLES = ['AGENCY_ADMIN', 'BILLING_MANAGER', 'FULFILLMENT_REVIEWER', 'DESIGNER_EDITOR', 'CLIENT_VIEWER'] as const;
export type AgencyTeamRole = (typeof AGENCY_TEAM_ROLES)[number];

export const AGENCY_BRANDING_REVIEW_STATUSES = ['DRAFT', 'NEEDS_REVIEW', 'APPROVED', 'REJECTED'] as const;
export type AgencyBrandingReviewStatus = (typeof AGENCY_BRANDING_REVIEW_STATUSES)[number];

export const AGENCY_VOLUME_TIERS = [
  { key: 'starter', label: 'Agency Starter', minimumImages: 0, includedImages: 250, baseMonthlyCents: 100000, overageCentsPerImage: 500 },
  { key: 'growth', label: 'Agency Growth', minimumImages: 500, includedImages: 750, baseMonthlyCents: 180000, overageCentsPerImage: 350 },
  { key: 'scale', label: 'Agency Scale', minimumImages: 1500, includedImages: 2000, baseMonthlyCents: 300000, overageCentsPerImage: 250 },
] as const;

export const AGENCY_WHITE_LABEL_SAFE_COPY = {
  scopeNotice: 'Agency mode supports multi-client fulfillment, branded delivery, branded reports, bulk queues, team access, and volume pricing scaffolds.',
  runtimeNotice: 'All agency records must be loaded server-side with organization, agency, and client workspace scope. Demo rows are dry-run scaffolds only.',
  brandingNotice: 'White-label settings require manual review before client-facing delivery, report, domain, footer, or logo changes are used in production.',
  deliveryNotice: 'Branded delivery pages must still enforce approval gates, expiring delivery tokens, download limits, and original-upload preservation.',
  reportsNotice: 'Branded reports must exclude secrets, raw provider data, private admin notes, signed URLs, raw webhook payloads, and unapproved outputs.',
  billingNotice: 'Volume pricing is a quoting scaffold until Codex wires verified subscriptions, invoices, credits, and payment provider records.',
  guaranteeNotice: 'Do not guarantee marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.',
} as const;

export type AgencyWorkspaceInput = {
  id: string;
  clientId?: string | null;
  clientName: string;
  workspaceName: string;
  status?: AgencyWorkspaceStatus | string;
  sourceChannels?: string[];
  activeJobs?: number;
  completedJobs?: number;
  monthlyImageVolume?: number;
  whiteLabelEnabled?: boolean;
  brandedReportsEnabled?: boolean;
  lastDeliveryAt?: string | Date | null;
};

export type AgencyTeamMemberInput = {
  id: string;
  name: string;
  email: string;
  role: AgencyTeamRole | string;
  status?: 'INVITED' | 'ACTIVE' | 'SUSPENDED';
  clientWorkspaceCount?: number;
};

export type AgencyQueueItemInput = {
  id: string;
  workspaceId: string;
  clientName: string;
  jobTitle: string;
  packageName?: string;
  status: AgencyQueueStatus | string;
  imageCount?: number;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  dueAt?: string | Date | null;
  requiresManualReview?: boolean;
};

export type AgencyBrandSettingsDraft = {
  portalName?: string | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  supportEmail?: string | null;
  customDomain?: string | null;
  deliveryFooter?: string | null;
  hideListingLiftBranding?: boolean;
  reviewStatus?: AgencyBrandingReviewStatus | string;
};

export type AgencyVolumePricingInput = {
  monthlyImageVolume: number;
  workspaceCount: number;
  rushQueueEnabled?: boolean;
  brandedReportsEnabled?: boolean;
  apiAccessRequested?: boolean;
  currency?: string;
};

export function normalizeAgencyWorkspaceStatus(status?: string | null): AgencyWorkspaceStatus {
  const normalized = (status ?? 'LEAD').trim().toUpperCase().replaceAll(' ', '_').replaceAll('-', '_');
  if ((AGENCY_WORKSPACE_STATUSES as readonly string[]).includes(normalized)) return normalized as AgencyWorkspaceStatus;
  return 'LEAD';
}

export function normalizeAgencyQueueStatus(status?: string | null): AgencyQueueStatus {
  const normalized = (status ?? 'PLANNED').trim().toUpperCase().replaceAll(' ', '_').replaceAll('-', '_');
  if ((AGENCY_QUEUE_STATUSES as readonly string[]).includes(normalized)) return normalized as AgencyQueueStatus;
  return 'PLANNED';
}

export function getAgencyWorkspaceStatusTone(status?: string | null) {
  const normalized = normalizeAgencyWorkspaceStatus(status);
  if (normalized === 'ACTIVE') return 'green' as const;
  if (normalized === 'PAUSED') return 'amber' as const;
  if (normalized === 'ARCHIVED') return 'slate' as const;
  return 'blue' as const;
}

export function getAgencyQueueStatusTone(status?: string | null) {
  const normalized = normalizeAgencyQueueStatus(status);
  if (normalized === 'DELIVERED') return 'green' as const;
  if (normalized === 'FLAGGED' || normalized === 'BLOCKED') return 'red' as const;
  if (normalized === 'WAITING_FOR_REVIEW' || normalized === 'READY_FOR_DELIVERY') return 'amber' as const;
  return 'blue' as const;
}

export function buildAgencyWorkspaceLabel(workspace: Pick<AgencyWorkspaceInput, 'clientName' | 'workspaceName'>) {
  return workspace.workspaceName === workspace.clientName ? workspace.clientName : `${workspace.clientName} — ${workspace.workspaceName}`;
}

export function summarizeAgencyWorkspaces(workspaces: AgencyWorkspaceInput[]) {
  return workspaces.reduce(
    (summary, workspace) => {
      const status = normalizeAgencyWorkspaceStatus(workspace.status);
      summary.totalWorkspaces += 1;
      if (status === 'ACTIVE') summary.activeWorkspaces += 1;
      if (workspace.whiteLabelEnabled) summary.whiteLabelWorkspaces += 1;
      if (workspace.brandedReportsEnabled) summary.brandedReportWorkspaces += 1;
      summary.activeJobs += workspace.activeJobs ?? 0;
      summary.completedJobs += workspace.completedJobs ?? 0;
      summary.monthlyImageVolume += workspace.monthlyImageVolume ?? 0;
      return summary;
    },
    { totalWorkspaces: 0, activeWorkspaces: 0, whiteLabelWorkspaces: 0, brandedReportWorkspaces: 0, activeJobs: 0, completedJobs: 0, monthlyImageVolume: 0 },
  );
}

export function summarizeAgencyQueue(items: AgencyQueueItemInput[]) {
  return items.reduce(
    (summary, item) => {
      const status = normalizeAgencyQueueStatus(item.status);
      summary.totalItems += 1;
      summary.totalImages += item.imageCount ?? 0;
      if (status === 'READY_FOR_PROCESSING' || status === 'PROCESSING') summary.inProduction += 1;
      if (status === 'WAITING_FOR_REVIEW' || item.requiresManualReview) summary.needsReview += 1;
      if (status === 'FLAGGED' || status === 'BLOCKED') summary.blocked += 1;
      if (status === 'READY_FOR_DELIVERY') summary.readyForDelivery += 1;
      return summary;
    },
    { totalItems: 0, totalImages: 0, inProduction: 0, needsReview: 0, blocked: 0, readyForDelivery: 0 },
  );
}

export function formatAgencyMoneyFromCents(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

export function quoteAgencyVolumePricing(input: AgencyVolumePricingInput) {
  const currency = input.currency ?? 'USD';
  const selectedTier = [...AGENCY_VOLUME_TIERS].reverse().find((tier) => input.monthlyImageVolume >= tier.minimumImages) ?? AGENCY_VOLUME_TIERS[0];
  const overageImages = Math.max(0, input.monthlyImageVolume - selectedTier.includedImages);
  const rushQueueCents = input.rushQueueEnabled ? 30000 : 0;
  const brandedReportsCents = input.brandedReportsEnabled ? 20000 : 0;
  const apiAccessCents = input.apiAccessRequested ? 50000 : 0;
  const workspaceCents = Math.max(0, input.workspaceCount - 5) * 5000;
  const estimatedMonthlyCents = selectedTier.baseMonthlyCents + overageImages * selectedTier.overageCentsPerImage + rushQueueCents + brandedReportsCents + apiAccessCents + workspaceCents;
  return {
    tierKey: selectedTier.key,
    tierLabel: selectedTier.label,
    currency,
    includedImages: selectedTier.includedImages,
    overageImages,
    overageCentsPerImage: selectedTier.overageCentsPerImage,
    baseMonthlyCents: selectedTier.baseMonthlyCents,
    addOnCents: rushQueueCents + brandedReportsCents + apiAccessCents + workspaceCents,
    estimatedMonthlyCents,
    formattedBaseMonthly: formatAgencyMoneyFromCents(selectedTier.baseMonthlyCents, currency),
    formattedEstimatedMonthly: formatAgencyMoneyFromCents(estimatedMonthlyCents, currency),
    manualReviewRequired: true,
    billingNotice: AGENCY_WHITE_LABEL_SAFE_COPY.billingNotice,
  };
}

export function buildAgencyBrandPreview(settings: AgencyBrandSettingsDraft = {}) {
  const reviewStatus = (settings.reviewStatus ?? 'DRAFT').toString().toUpperCase();
  return {
    portalName: settings.portalName?.trim() || 'Agency Client Portal',
    logoUrl: settings.logoUrl ?? null,
    primaryColor: settings.primaryColor ?? '#0f172a',
    secondaryColor: settings.secondaryColor ?? '#2563eb',
    supportEmail: settings.supportEmail ?? 'support@example-agency.test',
    customDomain: settings.customDomain ?? null,
    deliveryFooter: settings.deliveryFooter ?? 'Prepared by your ecommerce image partner.',
    hideListingLiftBranding: Boolean(settings.hideListingLiftBranding),
    reviewStatus: (AGENCY_BRANDING_REVIEW_STATUSES as readonly string[]).includes(reviewStatus) ? reviewStatus : 'DRAFT',
    manualReviewRequired: true,
    safeCopy: AGENCY_WHITE_LABEL_SAFE_COPY.brandingNotice,
  };
}

export function agencyWhiteLabelCopyContainsUnsafeGuarantee(copy: string) {
  const normalized = copy
    .toLowerCase()
    .replace(/(does not|do not|cannot|can't|no)\s+guarantee(s|d)?\s+(marketplace\s+)?(approval|ranking|sales|conversion|listing approval|product approval|ad performance|performance)/g, 'safe-no-guarantee-claim');
  const unsafeTerms = [
    'guarantee marketplace approval',
    'guaranteed marketplace approval',
    'guarantee approval',
    'guaranteed approval',
    'guarantee listing approval',
    'guaranteed listing approval',
    'guarantee product approval',
    'guaranteed product approval',
    'guarantee sales',
    'guaranteed sales',
    'guarantee ranking',
    'guaranteed ranking',
    'guarantee conversion',
    'guaranteed conversion',
    'guarantee ad performance',
    'guaranteed ad performance',
  ];
  return unsafeTerms.some((term) => normalized.includes(term));
}
