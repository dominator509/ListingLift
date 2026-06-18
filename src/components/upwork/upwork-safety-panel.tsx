import { UPWORK_MARKETPLACE_SAFETY_RULES } from '@/domain/upwork';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UpworkSafetyPanel() {
  return <Card><CardHeader><CardTitle>Upwork safety rules</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-sm text-slate-600">{UPWORK_MARKETPLACE_SAFETY_RULES.map((rule) => <li key={rule}>• {rule}</li>)}</ul></CardContent></Card>;
}
