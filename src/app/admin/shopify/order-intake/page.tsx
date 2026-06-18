import { PageHeader } from '@/components/ui/page-header';
import { ShopifyManualOrderForm, ShopifyProductImportPanel } from '@/components/shopify';

export default function ShopifyOrderIntakePage() {
  return (
    <main className="space-y-6">
      <PageHeader title="Shopify order intake" description="Capture manual Shopify image-pack orders and product/SKU context before creating normalized ListingLift jobs." />
      <ShopifyManualOrderForm />
      <ShopifyProductImportPanel />
    </main>
  );
}
