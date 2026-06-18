import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const gates = ['Verified payment', 'Active subscription', 'Available credits', 'Audited manual invoice confirmation'];

export function BillingLicenseGatePanel() {
  return (
    <Card title="Billing and license gate" description="Fulfillment may continue through any verified payment path, but failed or unverified payments must not unlock delivery, uploads, credits, or dashboards.">
      <ul className="space-y-2 text-sm text-slate-600">
        {gates.map((gate) => <li key={gate}><Badge tone="blue">gate</Badge> {gate}</li>)}
      </ul>
    </Card>
  );
}
