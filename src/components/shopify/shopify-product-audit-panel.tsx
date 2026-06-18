import { buildShopifyProductPageAudit } from '@/domain/shopify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ShopifyProductAuditPanel() {
  const audit = buildShopifyProductPageAudit({ productTitles: ['Minimal candle', 'Ceramic mug'], flaggedIssues: ['Review product grid crop consistency before publishing.'], consistencyScore: 82 });
  return (
    <Card>
      <CardHeader><CardTitle>Shopify product-page visual audit</CardTitle></CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {audit.sections.map((section) => (
          <div key={section.key} className="rounded-lg border p-3 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{section.title}</p>
            <ul className="mt-2 space-y-1">{section.notes.map((note) => <li key={note}>• {note}</li>)}</ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
