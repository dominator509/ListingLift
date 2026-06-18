import { PageHeader } from '@/components/ui/page-header';
import { ShopifyWorkflowBoard, ShopifySafetyPanel } from '@/components/shopify';

export default function AdminShopifyPage() {
  return (
    <main className="space-y-6">
      <PageHeader title="Shopify Workflow" description="Manual-first Shopify product image workflow with product/SKU grouping, merchant approval, and OAuth scaffold controls." />
      <ShopifyWorkflowBoard />
      <ShopifySafetyPanel />
    </main>
  );
}
