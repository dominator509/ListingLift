import { PageHeader } from '@/components/ui/page-header';
import { ShopifyDeliveryTemplatePanel } from '@/components/shopify';

export default function ShopifyDeliveryPage() {
  return (
    <main className="space-y-6">
      <PageHeader title="Shopify delivery" description="Generate merchant-safe delivery copy and product/SKU export plans for approved Shopify image packs." />
      <ShopifyDeliveryTemplatePanel />
    </main>
  );
}
