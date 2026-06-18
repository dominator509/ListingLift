import { buildEtsyDeliveryMessage } from '@/domain/etsy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EtsyDeliveryTemplatePanel() {
  const preview = buildEtsyDeliveryMessage({ buyerName: 'seller', archiveName: 'ListingLift_Etsy_Delivery_Job123.zip', includeExternalLink: true, externalLinkAllowed: true });
  return (
    <Card>
      <CardHeader><CardTitle>Etsy delivery template</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <p>Manual operator copy for Etsy delivery. Do not automate buyer messages unless an approved integration permits it.</p>
        <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-700">{preview}</pre>
      </CardContent>
    </Card>
  );
}
