import {
  ADMIN_ANALYTICS_SAFE_COPY,
  formatAdminMoneyFromCents,
  getAdminDashboardJobGroup,
  isDueSoon,
  normalizeRevenueChannel,
  sumRevenueChannels,
  type AdminJobQueueItem,
  type AdminRevenueChannelInput,
} from '@/domain/admin-dashboard-analytics';

export type AdminDashboardSummaryInput = {
  organizationId?: string | null;
  activeJobs?: number;
  completedJobs?: number;
  newJobsBySource?: number;
  flaggedOutputs?: number;
  jobsDueSoon?: number;
  revenueChannels?: AdminRevenueChannelInput[];
  marketplaceToDirectConversions?: number;
  retainerOpportunityAlerts?: number;
  upsellOpportunities?: number;
  currency?: string;
};

export function buildAdminDashboardSummary(input: AdminDashboardSummaryInput = {}) {
  const revenueChannels = (input.revenueChannels ?? []).map(normalizeRevenueChannel);
  const revenueTotals = sumRevenueChannels(revenueChannels);
  const currency = input.currency ?? revenueChannels[0]?.currency ?? 'USD';
  return {
    organizationId: input.organizationId ?? null,
    metrics: {
      activeJobs: input.activeJobs ?? 0,
      completedJobs: input.completedJobs ?? 0,
      newJobsBySource: input.newJobsBySource ?? 0,
      flaggedOutputs: input.flaggedOutputs ?? 0,
      jobsDueSoon: input.jobsDueSoon ?? 0,
      marketplaceToDirectConversions: input.marketplaceToDirectConversions ?? revenueTotals.directConversionCount,
      retainerOpportunityAlerts: input.retainerOpportunityAlerts ?? revenueTotals.retainerCandidateCount,
      upsellOpportunities: input.upsellOpportunities ?? 0,
    },
    revenue: {
      currency,
      grossRevenueCents: revenueTotals.grossRevenueCents,
      refundCents: revenueTotals.refundCents,
      netRevenueCents: revenueTotals.netRevenueCents,
      formattedNetRevenue: formatAdminMoneyFromCents(revenueTotals.netRevenueCents, currency),
      orderCount: revenueTotals.orderCount,
      jobCount: revenueTotals.jobCount,
      completedJobCount: revenueTotals.completedJobCount,
      channelCount: revenueChannels.length,
    },
    sourceTracking: revenueChannels.map((channel) => ({
      channelKey: channel.channelKey,
      channelName: channel.channelName,
      channelType: channel.channelType,
      orderCount: channel.orderCount,
      jobCount: channel.jobCount,
      completedJobCount: channel.completedJobCount,
      netRevenueCents: channel.netRevenueCents,
      formattedNetRevenue: formatAdminMoneyFromCents(channel.netRevenueCents, channel.currency),
      directConversionCount: channel.directConversionCount,
      retainerCandidateCount: channel.retainerCandidateCount,
    })),
    notices: ADMIN_ANALYTICS_SAFE_COPY,
    dryRun: true,
  };
}

export function buildAdminJobQueueBuckets(jobs: AdminJobQueueItem[], now: Date = new Date()) {
  const buckets: Record<'active' | 'completed' | 'flagged' | 'blocked' | 'dueSoon' | 'unknown', AdminJobQueueItem[]> = {
    active: [],
    completed: [],
    flagged: [],
    blocked: [],
    dueSoon: [],
    unknown: [],
  };
  for (const job of jobs) {
    const group = getAdminDashboardJobGroup(job.status);
    if (group === 'blocked') buckets.blocked.push(job);
    else if (group === 'completed') buckets.completed.push(job);
    else if (group === 'flagged') buckets.flagged.push(job);
    else if (group === 'active') buckets.active.push(job);
    else buckets.unknown.push(job);

    if (isDueSoon({ deadline: job.deadline, status: job.status }, now)) buckets.dueSoon.push(job);
  }
  return buckets;
}

export const demoAdminDashboardJobs: AdminJobQueueItem[] = [
  { jobId: 'job_quick_cleanup_001', jobNumber: 'LL-1001', title: 'Jewelry cleanup pack', status: 'PROCESSING', clientName: 'Aster Handmade', sourceChannelName: 'Etsy', deadline: '2026-06-09T18:00:00.000Z', revenueCents: 14900, blockingQualityFlags: 0 },
  { jobId: 'job_marketplace_002', jobNumber: 'LL-1002', title: 'Shopify launch image pack', status: 'WAITING_FOR_REVIEW', clientName: 'Northstar Goods', sourceChannelName: 'Shopify', deadline: '2026-06-10T18:00:00.000Z', revenueCents: 49900, blockingQualityFlags: 0 },
  { jobId: 'job_flagged_003', jobNumber: 'LL-1003', title: 'TikTok Shop hero set', status: 'FLAGGED_OUTPUTS', clientName: 'Bright Pantry', sourceChannelName: 'TikTok Shop', deadline: '2026-06-12T18:00:00.000Z', revenueCents: 24900, blockingQualityFlags: 2 },
  { jobId: 'job_complete_004', jobNumber: 'LL-1004', title: 'Fiverr quick cleanup', status: 'COMPLETED', clientName: 'Manual Buyer', sourceChannelName: 'Fiverr', revenueCents: 8900, blockingQualityFlags: 0 },
];
