import { PageHeader } from '@/components/ui/page-header';
import { ShopifyImageReplacementApprovalPanel } from '@/components/shopify';

export default function ShopifyReplacementsPage() {
  return (
    <main className="space-y-6">
      <PageHeader title="Shopify replacement approvals" description="Track product-level approval before any manual or future API image replacement workflow." />
      <ShopifyImageReplacementApprovalPanel />
    </main>
  );
}
