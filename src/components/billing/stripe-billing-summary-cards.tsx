import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const items = [
  ['Checkout modes', 'Package, credits, subscriptions, retainers, agency plans'],
  ['Webhook safety', 'Signature verification and idempotent event processing required'],
  ['Access rule', 'Failed or pending payment never grants upload or dashboard access'],
];

export function StripeBillingSummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(([title, body]) => (
        <Card key={title} title={title}>
          <Badge tone="green">Phase 17</Badge>
          <p className="mt-4 text-sm leading-6 text-slate-600">{body}</p>
        </Card>
      ))}
    </div>
  );
}
