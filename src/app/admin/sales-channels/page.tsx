import { OrderNormalizationFlow, RevenueAttributionCard, SalesChannelRegistryTable } from '@/components/sales-channels';
import { PageHeader } from '@/components/ui/page-header';

export default function AdminSalesChannelsPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-10">
      <PageHeader
        eyebrow="Phase 7"
        title="Sales Channels"
        description="Normalize direct, payment, marketplace, freelance, ecommerce, social, local, community, CSV, email-parser, webhook, and manual sources into one ListingLift job model."
      />
      <SalesChannelRegistryTable />
      <OrderNormalizationFlow />
      <RevenueAttributionCard />
    </main>
  );
}
