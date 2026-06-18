import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SubscriptionStatusCard({ status = 'Not connected' }: { status?: string }) {
  return (
    <Card title="Subscription status" description="Subscription access is updated only from verified Stripe webhooks or manual admin confirmation.">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">Current state</span>
        <Badge tone={status === 'ACTIVE' ? 'green' : 'slate'}>{status}</Badge>
      </div>
    </Card>
  );
}
