import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { buildAgencyBrandedReportDraft } from '@/server/services/agency-white-label-settings-service';

type ReportDraft = ReturnType<typeof buildAgencyBrandedReportDraft>;

export function AgencyBrandedReportPanel({ report }: { report: ReportDraft }) {
  return (
    <Card title="Branded report preview" description="White-label report outline for client deliverables and monthly seller retainers.">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{report.reportType.replaceAll('_', ' ')}</Badge>
          <Badge tone="amber">Manual review required</Badge>
        </div>
        <h3 className="text-xl font-semibold text-slate-950">{report.reportTitle}</h3>
        <ul className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          {report.sections.map((section) => <li key={section} className="rounded-lg border border-slate-200 p-3">{section}</li>)}
        </ul>
        <p className="text-sm leading-6 text-slate-600">{report.safeCopy}</p>
        <p className="text-sm leading-6 text-slate-600">{report.guaranteeNotice}</p>
      </div>
    </Card>
  );
}
