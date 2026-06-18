import { DEFAULT_SHOPIFY_IMAGE_PACKS, SHOPIFY_MARKETPLACE_SAFETY_RULES } from '@/domain/shopify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ShopifyWorkflowBoard() {
  const columns = ['Store captured', 'Product CSV/import', 'Files received', 'Processing', 'Replacement approval', 'Delivery/revision'];
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((column) => (
        <Card key={column}>
          <CardHeader><CardTitle>{column}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Manual-first Shopify workflow stage with merchant-review required.</p>
            <p className="text-xs text-slate-500">Preset focus: Shopify product-gallery and website gallery drafts.</p>
          </CardContent>
        </Card>
      ))}
      <Card className="lg:col-span-3">
        <CardHeader><CardTitle>Shopify workflow safety</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-slate-600">Supported packs: {DEFAULT_SHOPIFY_IMAGE_PACKS.map((pack) => pack.title).join(', ')}</p>
          <ul className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            {SHOPIFY_MARKETPLACE_SAFETY_RULES.slice(0, 6).map((rule) => <li key={rule}>• {rule}</li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
