import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getScopeTone, type ApiAccessScope } from '@/domain/api-access';
import { getApiScopeMatrix } from '@/server/services/api-access-plan-service';

export function ApiScopeMatrixPanel({ planKey = 'AGENCY' }: { planKey?: string }) {
  const rows = getApiScopeMatrix(planKey);
  return (
    <Card title="Scope matrix" description="Phase 36 scopes map API capability to plan gating and enforcement risk.">
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.scope} className="rounded-xl border border-slate-100 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-950">{row.scope}</p>
                <p className="mt-1 text-sm text-slate-600">{row.description}</p>
              </div>
              <div className="flex gap-2">
                <Badge tone={getScopeTone(row.scope as ApiAccessScope)}>{row.risk} risk</Badge>
                <Badge tone={row.allowedForPlan ? 'green' : 'slate'}>{row.allowedForPlan ? `Allowed on ${row.currentPlan}` : `Requires ${row.planRequired}`}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
