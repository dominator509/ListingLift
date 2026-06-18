import { AdminAnalyticsGuardrailPanel, AdminConversionRetainerPanel } from '@/components/admin-dashboard';
import { PageHeader } from '@/components/ui/page-header';
import { buildRetainerOpportunityAlerts, demoRetainerSignals } from '@/server/services/admin-revenue-analytics-service';

export default function AdminRevenueRetainersPage() {
  const retainerAlerts = buildRetainerOpportunityAlerts(demoRetainerSignals, 50, false);
  return (
    <main className="space-y-8 p-6">
      <PageHeader title="Retainer opportunity alerts" description="Manual-review alerts for clients who may benefit from monthly image retainers, refresh packs, or dashboard upgrades." />
      <AdminConversionRetainerPanel conversions={[]} retainerAlerts={retainerAlerts} />
      <AdminAnalyticsGuardrailPanel />
    </main>
  );
}
