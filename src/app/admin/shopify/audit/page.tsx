import { PageHeader } from '@/components/ui/page-header';
import { ShopifyProductAuditPanel } from '@/components/shopify';

export default function ShopifyAuditPage() {
  return (
    <main className="space-y-6">
      <PageHeader title="Shopify product-page audit" description="Draft product gallery sequence notes and storefront image consistency scores for merchant review." />
      <ShopifyProductAuditPanel />
    </main>
  );
}
