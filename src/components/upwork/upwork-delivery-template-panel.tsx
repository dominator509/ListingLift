import { buildUpworkDeliveryTemplate } from '@/domain/upwork';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UpworkDeliveryTemplatePanel() {
  const copy = buildUpworkDeliveryTemplate({ archiveFileName: 'ListingLift_Delivery_Client_Job123.zip', deliveryMode: 'UPWORK_ATTACHMENT' });
  return <Card><CardHeader><CardTitle>Delivery template</CardTitle></CardHeader><CardContent><pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700">{copy}</pre></CardContent></Card>;
}
