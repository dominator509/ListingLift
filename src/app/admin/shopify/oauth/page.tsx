import { PageHeader } from '@/components/ui/page-header';
import { ShopifyOAuthScaffoldPanel, ShopifySafetyPanel } from '@/components/shopify';

export default function ShopifyOAuthPage() {
  return (
    <main className="space-y-6">
      <PageHeader title="Shopify OAuth scaffold" description="Plan scoped Shopify app access without enabling real API calls by default." />
      <ShopifyOAuthScaffoldPanel />
      <ShopifySafetyPanel />
    </main>
  );
}
