import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { buildAgencyBrandedDeliveryDraft } from '@/server/services/agency-white-label-settings-service';

type DeliveryDraft = ReturnType<typeof buildAgencyBrandedDeliveryDraft>;

export function AgencyBrandedDeliveryPanel({ draft }: { draft: DeliveryDraft }) {
  return (
    <Card title="Branded delivery page" description="Client-facing delivery copy preview. Production delivery must still use approval, token, and download gates.">
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap gap-2">
          <Badge tone="purple">White-label draft</Badge>
          <Badge tone={draft.approvalGateRequired ? 'amber' : 'green'}>Approval gate required</Badge>
          <Badge tone={draft.tokenGateRequired ? 'amber' : 'green'}>Expiring token required</Badge>
        </div>
        <p className="text-lg font-semibold text-slate-950">{draft.title}</p>
        <p className="text-sm leading-6 text-slate-600">{draft.body}</p>
        <p className="text-sm text-slate-500">Approved files: {draft.approvedFileCount}</p>
        <p className="text-xs leading-5 text-slate-500">{draft.footer}</p>
      </div>
    </Card>
  );
}
