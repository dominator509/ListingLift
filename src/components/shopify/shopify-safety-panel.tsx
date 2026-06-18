import { SHOPIFY_MARKETPLACE_SAFETY_RULES } from '@/domain/shopify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ShopifySafetyPanel() {
  return (
    <Card>
      <CardHeader><CardTitle>Shopify safety checklist</CardTitle></CardHeader>
      <CardContent>
        <ul className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          {SHOPIFY_MARKETPLACE_SAFETY_RULES.map((rule) => <li key={rule}>• {rule}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}
