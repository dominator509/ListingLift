import { guardedGet } from '@/server/routes/route-helpers';
import { buildAdminDashboardSummary, buildAdminJobQueueBuckets, demoAdminDashboardJobs } from '@/server/services/admin-dashboard-summary-service';
import { buildRetainerOpportunityAlerts, buildRevenueAnalyticsSnapshot, demoConversionCandidates, demoRetainerSignals, demoRevenueChannels, detectMarketplaceToDirectConversionCandidates } from '@/server/services/admin-revenue-analytics-service';

export async function GET(request: Request) {
  return guardedGet(request, 'view:revenue', async () => {
    const revenueSnapshot = buildRevenueAnalyticsSnapshot(demoRevenueChannels);
    return {
      dryRun: true,
      summary: buildAdminDashboardSummary({ organizationId: 'runtime-session-organization', activeJobs: 2, completedJobs: 1, newJobsBySource: 5, flaggedOutputs: 1, jobsDueSoon: 2, revenueChannels: demoRevenueChannels, upsellOpportunities: 4 }),
      jobBuckets: buildAdminJobQueueBuckets(demoAdminDashboardJobs, new Date('2026-06-07T12:00:00.000Z')),
      revenueSnapshot,
      conversions: detectMarketplaceToDirectConversionCandidates(demoConversionCandidates),
      retainerAlerts: buildRetainerOpportunityAlerts(demoRetainerSignals, 50, false),
      codexNote: 'Codex must replace dry-run data with tenant-scoped Prisma queries, verified payment/order records, server-side RBAC, and audit logging.',
    };
  });
}
