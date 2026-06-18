import { describe, expect, it } from 'vitest';
import { buildAdminDashboardSummary, buildAdminJobQueueBuckets } from '@/server/services/admin-dashboard-summary-service';

const revenueChannels = [
  { channelKey: 'Direct', channelName: 'Direct Website', orderCount: 2, jobCount: 2, completedJobCount: 1, grossRevenueCents: 10000, directConversionCount: 0 },
  { channelKey: 'Etsy', channelName: 'Etsy', orderCount: 3, jobCount: 3, completedJobCount: 2, grossRevenueCents: 30000, refundCents: 5000, directConversionCount: 1, retainerCandidateCount: 2 },
];

describe('admin dashboard summary service', () => {
  it('rolls up revenue channels and preserves analytics guardrail notices', () => {
    const summary = buildAdminDashboardSummary({ activeJobs: 4, completedJobs: 3, revenueChannels });
    expect(summary.metrics.activeJobs).toBe(4);
    expect(summary.revenue.netRevenueCents).toBe(35000);
    expect(summary.metrics.marketplaceToDirectConversions).toBe(1);
    expect(summary.metrics.retainerOpportunityAlerts).toBe(2);
    expect(summary.notices.revenueNotice).toContain('verified payment');
  });

  it('groups job queue buckets including due-soon jobs', () => {
    const buckets = buildAdminJobQueueBuckets([
      { jobId: 'job-1', title: 'Active', status: 'PROCESSING', deadline: '2026-06-08T12:00:00.000Z' },
      { jobId: 'job-2', title: 'Flagged', status: 'FLAGGED_OUTPUTS' },
      { jobId: 'job-3', title: 'Done', status: 'COMPLETED' },
    ], new Date('2026-06-07T12:00:00.000Z'));
    expect(buckets.active).toHaveLength(1);
    expect(buckets.flagged).toHaveLength(1);
    expect(buckets.completed).toHaveLength(1);
    expect(buckets.dueSoon).toHaveLength(1);
  });
});
