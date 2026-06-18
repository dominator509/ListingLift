import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/workflow/progress-bar';

export function SubscriptionEntitlementPanel({ allowance = 100, used = 35, status = 'ACTIVE' }: { allowance?: number; used?: number; status?: string }) {
  const pct = allowance > 0 ? Math.round((used / allowance) * 100) : 0;
  return (
    <Card title="Subscription entitlement" description="Monthly allowances reset from verified subscription state or audited manual billing action.">
      <div className="mb-4 flex items-center justify-between"><span className="text-sm text-slate-600">{used} of {allowance} images used</span><Badge tone={status === 'ACTIVE' ? 'green' : 'amber'}>{status}</Badge></div>
      <ProgressBar value={pct} />
      <p className="mt-3 text-xs text-slate-500">Codex must derive this from Subscription + SubscriptionEntitlement rows, never client-submitted values.</p>
    </Card>
  );
}
