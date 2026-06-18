import { DEFAULT_SHOPIFY_IMAGE_PACKS } from '@/domain/shopify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ShopifyManualOrderForm() {
  return (
    <Card>
      <CardHeader><CardTitle>Manual Shopify job intake</CardTitle></CardHeader>
      <CardContent className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <p>Capture store domain, store name, merchant contact, product IDs, SKUs, product titles, image quantity, package, amount, deadline, and source URL.</p>
        <p>Codex must wire this shell to server-side validation, duplicate prevention, Client, ExternalOrder, Job, UploadToken, ShopifyWorkflowEvent, and AuditLog creation.</p>
        <div className="rounded-lg border p-3 md:col-span-2">
          <p className="font-medium text-slate-900">Default Shopify packs</p>
          <ul className="mt-2 grid gap-2 md:grid-cols-3">
            {DEFAULT_SHOPIFY_IMAGE_PACKS.map((pack) => <li key={pack.key}>{pack.title} → {pack.packageKey}</li>)}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
