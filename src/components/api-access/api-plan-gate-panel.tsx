import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { evaluateApiPlanGate } from '@/domain/api-access';

export function ApiPlanGatePanel() {
  const agencyDecision = evaluateApiPlanGate({ planKey: 'AGENCY', requestedScopes: ['jobs:create', 'uploads:create', 'presets:read'] });
  const scaleDecision = evaluateApiPlanGate({ planKey: 'AGENCY_SCALE', requestedScopes: ['webhooks:manage', 'presets:write'] });
  return (
    <Card title="Plan gate preview" description="API access must be evaluated from verified subscriptions, invoices, agency plan, token status, and payment status before any scope is honored.">
      <div className="grid gap-3 md:grid-cols-2">
        {[agencyDecision, scaleDecision].map((decision) => (
          <div key={decision.planKey} className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-slate-950">{decision.planKey}</p>
              <Badge tone={decision.allowed ? 'green' : 'red'}>{decision.allowed ? 'Allowed' : 'Blocked'}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-600">Requested: {decision.requestedScopes.join(', ')}</p>
            {decision.reasons.length ? <p className="mt-2 text-xs text-rose-700">{decision.reasons.join(' ')}</p> : <p className="mt-2 text-xs text-slate-500">Codex must persist and audit this gate for each request.</p>}
          </div>
        ))}
      </div>
    </Card>
  );
}
