import { PageHeader } from '@/components/ui/page-header';
import { ShopifyProductImportPanel } from '@/components/shopify';

export default function ShopifyProductsPage() {
  return (
    <main className="space-y-6">
      <PageHeader title="Shopify products and SKUs" description="Plan product export CSV/API-scaffold imports and ZIP grouping by product or SKU." />
      <ShopifyProductImportPanel />
    </main>
  );
}
