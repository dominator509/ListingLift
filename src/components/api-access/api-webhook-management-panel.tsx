import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type WebhookRow = { id: string; provider: string; targetUrl: string; eventTypes: string[]; status: string; signingSecret: string };

export function ApiWebhookManagementPanel({ webhooks }: { webhooks: WebhookRow[] }) {
  return (
    <Card title="Webhook management" description="Outbound webhooks require signing-secret references, retries, dead-letter handling, rate limits, and no raw secret exposure.">
      <div className="space-y-3">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="rounded-xl border border-slate-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-950">{webhook.provider}</p>
                <p className="mt-1 text-xs text-slate-500">{webhook.targetUrl}</p>
              </div>
              <Badge tone={webhook.status === 'DRAFT' ? 'amber' : 'slate'}>{webhook.status}</Badge>
            </div>
            <p className="mt-3 text-sm text-slate-600">Events: {webhook.eventTypes.join(', ')}</p>
            <p className="mt-1 text-xs text-slate-500">Signing secret: {webhook.signingSecret}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
