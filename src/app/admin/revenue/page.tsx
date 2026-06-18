import { AdminAnalyticsGuardrailPanel, AdminConversionRetainerPanel, AdminDashboardMetricCard, AdminRevenueChannelTable } from '@/components/admin-dashboard';
import { PageHeader } from '@/components/ui/page-header';
import { buildRetainerOpportunityAlerts, buildRevenueAnalyticsSnapshot, demoConversionCandidates, demoRetainerSignals, demoRevenueChannels, detectMarketplaceToDirectConversionCandidates } from '@/server/services/admin-revenue-analytics-service';

export default function AdminRevenuePage() {
  const snapshot = buildRevenueAnalyticsSnapshot(demoRevenueChannels);
  const conversions = detectMarketplaceToDirectConversionCandidates(demoConversionCandidates);
  const retainerAlerts = buildRetainerOpportunityAlerts(demoRetainerSignals, 50, false);
  return (
    <main className="space-y-8 p-6">
      <PageHeader
        eyebrow="Phase 34"
        title="Revenue analytics"
        description="Revenue, source attribution, conversion signals, and retainer opportunities for ListingLift fulfillment operations."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <AdminDashboardMetricCard label="Gross revenue" value={snapshot.totals.formattedGrossRevenue} helper="Before refunds and adjustments." />
        <AdminDashboardMetricCard label="Net revenue" value={snapshot.totals.formattedNetRevenue} helper="Dry-run estimate until verified by Codex." />
        <AdminDashboardMetricCard label="Orders" value={snapshot.totals.orderCount} helper="All normalized sources." />
        <AdminDashboardMetricCard label="Direct conversions" value={snapshot.totals.directConversionCount} helper={`${snapshot.totals.conversionRatePercent}% of seeded orders.`} />
      </div>
      <AdminRevenueChannelTable channels={snapshot.channels} />
      <AdminConversionRetainerPanel conversions={conversions} retainerAlerts={retainerAlerts} />
      <AdminAnalyticsGuardrailPanel />
    </main>
  );
}
