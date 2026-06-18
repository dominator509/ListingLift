import { buildShopifyDeliveryMessage } from '@/domain/shopify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ShopifyDeliveryTemplatePanel() {
  const preview = buildShopifyDeliveryMessage({ merchantName: 'merchant', archiveName: 'ListingLift_Shopify_Delivery_Job123.zip', storeDomain: 'demo-store.myshopify.com', includeExternalLink: true, externalLinkAllowed: true });
  return (
    <Card>
      <CardHeader><CardTitle>Shopify delivery template</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <p>Manual operator copy for Shopify delivery. Do not replace product images automatically unless an approved, scoped integration permits it and merchant approval exists.</p>
        <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-700">{preview}</pre>
      </CardContent>
    </Card>
  );
}
