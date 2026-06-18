import { Card } from '@/components/ui/card';
import { ADMIN_ANALYTICS_SAFE_COPY } from '@/domain/admin-dashboard-analytics';

export function AdminAnalyticsGuardrailPanel() {
  return (
    <Card title="Admin analytics guardrails" description="Phase 34 remains a dry-run scaffold until Codex wires Prisma, RBAC, audit logs, and verified payment/source data.">
      <ul className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
        <li className="rounded-xl bg-slate-50 p-4">{ADMIN_ANALYTICS_SAFE_COPY.revenueNotice}</li>
        <li className="rounded-xl bg-slate-50 p-4">{ADMIN_ANALYTICS_SAFE_COPY.sourceNotice}</li>
        <li className="rounded-xl bg-slate-50 p-4">{ADMIN_ANALYTICS_SAFE_COPY.conversionNotice}</li>
        <li className="rounded-xl bg-slate-50 p-4">{ADMIN_ANALYTICS_SAFE_COPY.privacyNotice}</li>
      </ul>
    </Card>
  );
}
