import { AGENCY_WHITE_LABEL_SAFE_COPY } from '@/domain/agency-white-label';
import { Card } from '@/components/ui/card';

export function AgencyGuardrailPanel() {
  const notices = [
    AGENCY_WHITE_LABEL_SAFE_COPY.runtimeNotice,
    AGENCY_WHITE_LABEL_SAFE_COPY.brandingNotice,
    AGENCY_WHITE_LABEL_SAFE_COPY.deliveryNotice,
    AGENCY_WHITE_LABEL_SAFE_COPY.reportsNotice,
    AGENCY_WHITE_LABEL_SAFE_COPY.billingNotice,
    AGENCY_WHITE_LABEL_SAFE_COPY.guaranteeNotice,
  ];
  return (
    <Card title="Agency mode guardrails" description="These rules stay active across dashboard, workspaces, queue, delivery, reports, billing, and team actions.">
      <ul className="grid gap-3 text-sm leading-6 text-slate-600 md:grid-cols-2">
        {notices.map((notice) => <li key={notice} className="rounded-xl border border-slate-200 p-3">{notice}</li>)}
      </ul>
    </Card>
  );
}
