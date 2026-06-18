export const ADMIN_DASHBOARD_ANALYTICS_PHASE = 'phase-34-admin-dashboard-revenue-analytics' as const;

export const ADMIN_DASHBOARD_SECTIONS = [
  'OVERVIEW',
  'ACTIVE_JOBS',
  'COMPLETED_JOBS',
  'SOURCE_TRACKING',
  'FLAGGED_OUTPUTS',
  'DUE_SOON',
  'REVENUE',
  'CONVERSIONS',
  'RETAINER_ALERTS',
  'UPSELLS',
] as const;

export type AdminDashboardSection = (typeof ADMIN_DASHBOARD_SECTIONS)[number];

export const ADMIN_DASHBOARD_JOB_STATUS_GROUPS = {
  active: ['WAITING_FOR_UPLOAD', 'UPLOAD_RECEIVED', 'PROCESSING_QUEUED', 'PROCESSING', 'WAITING_FOR_REVIEW', 'APPROVED', 'REVISION_REQUESTED', 'REPROCESSING', 'READY_FOR_DELIVERY'],
  completed: ['DELIVERED', 'COMPLETED'],
  flagged: ['FLAGGED_OUTPUTS', 'FAILED'],
  blocked: ['FLAGGED_OUTPUTS', 'FAILED', 'CANCELLED'],
} as const;

export type AdminDashboardJobGroup = keyof typeof ADMIN_DASHBOARD_JOB_STATUS_GROUPS | 'dueSoon' | 'unknown';

export const ADMIN_DASHBOARD_EVENT_TYPES = [
  'VIEW',
  'FILTER_JOBS',
  'OPEN_JOB',
  'OPEN_SOURCE_CHANNEL',
  'OPEN_REVENUE_DETAIL',
  'OPEN_CONVERSION_CANDIDATE',
  'OPEN_RETAINER_ALERT',
  'DISMISS_RETAINER_ALERT',
  'EXPORT_REVENUE_DRAFT',
  'REQUEST_MANUAL_REVIEW',
] as const;

export type AdminDashboardEventType = (typeof ADMIN_DASHBOARD_EVENT_TYPES)[number];

export const ADMIN_ANALYTICS_SAFE_COPY = {
  revenueNotice: 'Revenue analytics are internal operating estimates until Codex wires verified payment, invoice, refund, and external-order records.',
  sourceNotice: 'Source tracking must preserve channel attribution from checkout, webhook, manual order, marketplace workflow, and final job delivery.',
  conversionNotice: 'Marketplace-to-direct conversion tracking is an internal lead/opportunity signal only. Do not automate marketplace messages or platform circumvention.',
  retainerNotice: 'Retainer alerts are manual-review opportunities and do not guarantee sales, ranking, approval, conversion, or ad performance.',
  privacyNotice: 'Admin analytics must exclude secrets, raw webhook payloads, provider tokens, signed URLs, private client notes, and marketplace passwords.',
} as const;

export type AdminRevenueChannelInput = {
  channelKey: string;
  channelName: string;
  channelType?: string;
  orderCount?: number;
  jobCount?: number;
  completedJobCount?: number;
  grossRevenueCents?: number;
  refundCents?: number;
  currency?: string;
  directConversionCount?: number;
  retainerCandidateCount?: number;
};

export type AdminRevenueChannelSummary = Required<Omit<AdminRevenueChannelInput, 'channelType'>> & {
  channelType: string;
  netRevenueCents: number;
  averageOrderValueCents: number;
  conversionRatePercent: number;
};

export type AdminJobQueueItem = {
  jobId: string;
  jobNumber?: string;
  title: string;
  status: string;
  clientName?: string;
  sourceChannelName?: string;
  deadline?: string | Date | null;
  revenueCents?: number;
  blockingQualityFlags?: number;
  updatedAt?: string | Date | null;
};

export type AdminConversionCandidate = {
  clientId?: string;
  clientName: string;
  marketplaceSource: string;
  directSource?: string;
  marketplaceOrderCount: number;
  directOrderCount: number;
  grossRevenueCents: number;
  lastOrderAt?: string | Date | null;
};

export type RetainerOpportunitySignal = {
  clientId?: string;
  clientName: string;
  sourceChannel?: string;
  completedJobs: number;
  deliveredImages: number;
  lastDeliveryAt?: string | Date | null;
  daysSinceLastDelivery?: number;
  hasActiveSubscription?: boolean;
  creditBalance?: number;
  grossRevenueCents?: number;
};

export function normalizeAdminDashboardStatus(status: string) {
  return status.trim().toUpperCase().replaceAll(' ', '_').replaceAll('-', '_');
}

export function getAdminDashboardJobGroup(status: string): AdminDashboardJobGroup {
  const normalized = normalizeAdminDashboardStatus(status);
  if ((ADMIN_DASHBOARD_JOB_STATUS_GROUPS.completed as readonly string[]).includes(normalized)) return 'completed';
  if ((ADMIN_DASHBOARD_JOB_STATUS_GROUPS.flagged as readonly string[]).includes(normalized)) return 'flagged';
  if ((ADMIN_DASHBOARD_JOB_STATUS_GROUPS.active as readonly string[]).includes(normalized)) return 'active';
  if ((ADMIN_DASHBOARD_JOB_STATUS_GROUPS.blocked as readonly string[]).includes(normalized)) return 'blocked';
  return 'unknown';
}

export function isDueSoon(input: { deadline?: string | Date | null; status?: string | null }, now: Date = new Date(), windowDays = 3) {
  if (!input.deadline) return false;
  const statusGroup = getAdminDashboardJobGroup(input.status ?? '');
  if (statusGroup === 'completed' || statusGroup === 'blocked') return false;
  const deadline = input.deadline instanceof Date ? input.deadline : new Date(input.deadline);
  if (Number.isNaN(deadline.getTime())) return false;
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  return deadline.getTime() >= now.getTime() && deadline.getTime() <= now.getTime() + windowMs;
}

export function normalizeRevenueChannel(input: AdminRevenueChannelInput): AdminRevenueChannelSummary {
  const orderCount = input.orderCount ?? 0;
  const grossRevenueCents = input.grossRevenueCents ?? 0;
  const refundCents = input.refundCents ?? 0;
  const netRevenueCents = Math.max(0, grossRevenueCents - refundCents);
  const directConversionCount = input.directConversionCount ?? 0;
  return {
    channelKey: input.channelKey,
    channelName: input.channelName,
    channelType: input.channelType ?? 'MANUAL',
    orderCount,
    jobCount: input.jobCount ?? 0,
    completedJobCount: input.completedJobCount ?? 0,
    grossRevenueCents,
    refundCents,
    currency: input.currency ?? 'USD',
    directConversionCount,
    retainerCandidateCount: input.retainerCandidateCount ?? 0,
    netRevenueCents,
    averageOrderValueCents: orderCount > 0 ? Math.round(netRevenueCents / orderCount) : 0,
    conversionRatePercent: orderCount > 0 ? Math.round((directConversionCount / orderCount) * 100) : 0,
  };
}

export function sumRevenueChannels(channels: AdminRevenueChannelInput[]) {
  const normalized = channels.map(normalizeRevenueChannel);
  return normalized.reduce(
    (totals, channel) => ({
      grossRevenueCents: totals.grossRevenueCents + channel.grossRevenueCents,
      refundCents: totals.refundCents + channel.refundCents,
      netRevenueCents: totals.netRevenueCents + channel.netRevenueCents,
      orderCount: totals.orderCount + channel.orderCount,
      jobCount: totals.jobCount + channel.jobCount,
      completedJobCount: totals.completedJobCount + channel.completedJobCount,
      directConversionCount: totals.directConversionCount + channel.directConversionCount,
      retainerCandidateCount: totals.retainerCandidateCount + channel.retainerCandidateCount,
    }),
    { grossRevenueCents: 0, refundCents: 0, netRevenueCents: 0, orderCount: 0, jobCount: 0, completedJobCount: 0, directConversionCount: 0, retainerCandidateCount: 0 },
  );
}

export function formatAdminMoneyFromCents(cents?: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format((cents ?? 0) / 100);
}

export function scoreRetainerOpportunity(signal: RetainerOpportunitySignal) {
  let score = 0;
  if (!signal.hasActiveSubscription) score += 30;
  if (signal.completedJobs >= 2) score += 20;
  if (signal.deliveredImages >= 25) score += 15;
  if ((signal.daysSinceLastDelivery ?? 0) >= 14) score += 15;
  if ((signal.creditBalance ?? 0) <= 5) score += 10;
  if ((signal.grossRevenueCents ?? 0) >= 25000) score += 10;
  return Math.min(100, score);
}

export function adminAnalyticsCopyContainsUnsafeGuarantee(copy: string) {
  const normalized = copy
    .toLowerCase()
    .replace(/(does not|do not|cannot|can't|no)\s+guarantee(s|d)?\s+(marketplace\s+)?(approval|ranking|sales|conversion|ad performance|performance)/g, 'safe-no-guarantee-claim');
  const unsafeTerms = [
    'guarantee marketplace approval',
    'guaranteed marketplace approval',
    'guarantee approval',
    'guaranteed approval',
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
