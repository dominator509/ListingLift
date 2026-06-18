import { Card } from '@/components/ui/card';

export function AdminStripeRiskPanel() {
  return (
    <Card title="Phase 17 production gates" description="Do not mark Stripe billing complete until these checks pass in Codex.">
      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
        <li>Real Stripe SDK checkout works in test mode only.</li>
        <li>Webhook signatures are verified before processing.</li>
        <li>Duplicate Stripe events do not duplicate jobs, credits, or subscriptions.</li>
        <li>Failed payments do not grant access, credits, upload links, or dashboard access.</li>
        <li>All payment state changes are audited without logging secrets.</li>
      </ul>
    </Card>
  );
}
