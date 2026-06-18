import { Card } from '@/components/ui/card';
import { API_ACCESS_SAFE_COPY } from '@/domain/api-access';

export function ApiGuardrailPanel() {
  const rules = [
    API_ACCESS_SAFE_COPY.tokenNotice,
    API_ACCESS_SAFE_COPY.planNotice,
    API_ACCESS_SAFE_COPY.isolationNotice,
    API_ACCESS_SAFE_COPY.uploadNotice,
    API_ACCESS_SAFE_COPY.deliveryNotice,
    API_ACCESS_SAFE_COPY.webhookNotice,
    API_ACCESS_SAFE_COPY.integrationNotice,
    API_ACCESS_SAFE_COPY.guaranteeNotice,
  ];
  return (
    <Card title="Phase 36 guardrails" description="API access expands surface area, so Codex must wire runtime protections before any production use.">
      <ul className="space-y-2 text-sm text-slate-600">
        {rules.map((rule) => <li key={rule}>• {rule}</li>)}
      </ul>
    </Card>
  );
}
