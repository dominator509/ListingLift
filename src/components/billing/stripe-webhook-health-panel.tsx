import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function StripeWebhookHealthPanel() {
  return (
    <Card title="Stripe webhook safety" description="Codex must verify signatures before any event changes paid fulfillment state.">
      <ul className="space-y-2 text-sm text-slate-600">
        <li><Badge tone="amber">required</Badge> Verify `Stripe-Signature` with the configured webhook secret.</li>
        <li><Badge tone="amber">required</Badge> Dedupe by Stripe event ID before creating jobs or credits.</li>
        <li><Badge tone="red">blocked</Badge> Failed, expired, or unverified events must not grant access.</li>
      </ul>
    </Card>
  );
}
