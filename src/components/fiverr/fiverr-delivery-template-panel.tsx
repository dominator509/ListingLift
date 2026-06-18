import { Card } from '@/components/ui/card';
import { buildFiverrDeliveryTemplate } from '@/domain/fiverr';

export function FiverrDeliveryTemplatePanel() {
  const template = buildFiverrDeliveryTemplate({ buyerUsername: 'buyer', jobNumber: 'JOB-FIVERR-001', archiveFileName: 'ListingLift_Delivery.zip' });
  return (
    <Card title="Fiverr delivery template" description="Safe copy for manual Fiverr delivery. Does not guarantee platform approval or results.">
      <pre className="whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{template}</pre>
    </Card>
  );
}
