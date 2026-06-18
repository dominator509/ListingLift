import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ShopifyOAuthScaffoldPanel() {
  return (
    <Card>
      <CardHeader><CardTitle>Shopify OAuth app scaffold</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-600">
        <p>OAuth is scaffold-only in this seed. Real Shopify API calls must remain feature-flagged and use scoped permissions.</p>
        <p>Codex must store OAuth tokens only through encrypted secret references and never expose them to client-side code.</p>
      </CardContent>
    </Card>
  );
}
