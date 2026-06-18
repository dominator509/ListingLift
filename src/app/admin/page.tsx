import { AdminDashboardShell } from '@/components/admin-dashboard';
import { buildAdminDashboardSummary, buildAdminJobQueueBuckets, demoAdminDashboardJobs } from '@/server/services/admin-dashboard-summary-service';
import { buildRetainerOpportunityAlerts, buildRevenueAnalyticsSnapshot, demoConversionCandidates, demoRetainerSignals, detectMarketplaceToDirectConversionCandidates, demoRevenueChannels } from '@/server/services/admin-revenue-analytics-service';

export default function AdminDashboardPage() {
  const revenueSnapshot = buildRevenueAnalyticsSnapshot(demoRevenueChannels);
  const summary = buildAdminDashboardSummary({
    organizationId: 'demo-org',
    activeJobs: 2,
    completedJobs: 1,
    newJobsBySource: 5,
    flaggedOutputs: 1,
    jobsDueSoon: 2,
    revenueChannels: demoRevenueChannels,
    upsellOpportunities: 4,
  });
  const jobBuckets = buildAdminJobQueueBuckets(demoAdminDashboardJobs, new Date('2026-06-07T12:00:00.000Z'));
  const conversions = detectMarketplaceToDirectConversionCandidates(demoConversionCandidates);
  const retainerAlerts = buildRetainerOpportunityAlerts(demoRetainerSignals, 50, false);
  return <AdminDashboardShell summary={summary} jobBuckets={jobBuckets} revenueSnapshot={revenueSnapshot} conversions={conversions} retainerAlerts={retainerAlerts} />;
}
