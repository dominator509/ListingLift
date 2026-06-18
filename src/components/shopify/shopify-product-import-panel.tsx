import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ShopifyProductImportPanel() {
  return (
    <Card>
      <CardHeader><CardTitle>Shopify product/SKU import planner</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-600">
        <p>Prepare Shopify product export rows with product ID, handle, title, SKU, variant ID, product type, vendor, image count, and source URL.</p>
        <p>Phase 25 keeps this CSV/API-scaffold first. Codex must prohibit private Shopify admin scraping and store only minimal product metadata.</p>
      </CardContent>
    </Card>
  );
}
