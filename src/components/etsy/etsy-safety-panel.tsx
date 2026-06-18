import { ETSY_MARKETPLACE_SAFETY_RULES } from '@/domain/etsy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EtsySafetyPanel() {
  return (
    <Card>
      <CardHeader><CardTitle>Etsy safety checklist</CardTitle></CardHeader>
      <CardContent>
        <ul className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          {ETSY_MARKETPLACE_SAFETY_RULES.map((rule) => <li key={rule}>• {rule}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}
