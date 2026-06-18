import { AdminAnalyticsGuardrailPanel, AdminDashboardMetricCard, AdminRevenueChannelTable } from '@/components/admin-dashboard';
import { PageHeader } from '@/components/ui/page-header';
import { buildRevenueAnalyticsSnapshot, demoRevenueChannels } from '@/server/services/admin-revenue-analytics-service';

export default function AdminRevenueSourceTrackingPage() {
  const snapshot = buildRevenueAnalyticsSnapshot(demoRevenueChannels);
  return (
    <main className="space-y-8 p-6">
      <PageHeader title="Source tracking" description="Track jobs, revenue, completed jobs, conversion candidates, and retainer alerts by normalized sales channel." />
      <div className="grid gap-4 md:grid-cols-3">
        <AdminDashboardMetricCard label="Tracked channels" value={snapshot.channels.length} helper="Direct, payment, freelance, ecommerce, and social sources." />
        <AdminDashboardMetricCard label="Completed jobs" value={snapshot.totals.completedJobCount} helper="Seeded analytics snapshot." />
        <AdminDashboardMetricCard label="Net revenue" value={snapshot.totals.formattedNetRevenue} helper="Dry-run until payment records are wired." />
      </div>
      <AdminRevenueChannelTable channels={snapshot.channels} />
      <AdminAnalyticsGuardrailPanel />
    </main>
  );
}
