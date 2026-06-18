import { AdminAnalyticsGuardrailPanel, AdminConversionRetainerPanel } from '@/components/admin-dashboard';
import { PageHeader } from '@/components/ui/page-header';
import { buildRetainerOpportunityAlerts, demoConversionCandidates, demoRetainerSignals, detectMarketplaceToDirectConversionCandidates } from '@/server/services/admin-revenue-analytics-service';

export default function AdminRevenueConversionsPage() {
  const conversions = detectMarketplaceToDirectConversionCandidates(demoConversionCandidates);
  const retainerAlerts = buildRetainerOpportunityAlerts(demoRetainerSignals, 100, false);
  return (
    <main className="space-y-8 p-6">
      <PageHeader title="Marketplace-to-direct conversions" description="Internal signals for clients who moved from marketplace/manual sources into direct ListingLift channels." />
      <AdminConversionRetainerPanel conversions={conversions} retainerAlerts={retainerAlerts} />
      <AdminAnalyticsGuardrailPanel />
    </main>
  );
}
