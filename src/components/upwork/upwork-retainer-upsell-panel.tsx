import { buildUpworkRetainerUpsellReminder } from '@/domain/upwork';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UpworkRetainerUpsellPanel() {
  return <Card><CardHeader><CardTitle>Retainer upsell reminder</CardTitle></CardHeader><CardContent className="text-sm text-slate-700">{buildUpworkRetainerUpsellReminder({ monthlyImageEstimate: 100 })}</CardContent></Card>;
}
