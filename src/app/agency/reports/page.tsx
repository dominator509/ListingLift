import { AgencyBrandedReportPanel, AgencyGuardrailPanel } from '@/components/agency-white-label';
import { PageHeader } from '@/components/ui/page-header';
import { buildAgencyBrandedReportDraft } from '@/server/services/agency-white-label-settings-service';

export default function AgencyReportsPage() {
  const report = buildAgencyBrandedReportDraft({ clientName: 'Aster Handmade', reportType: 'MONTHLY_RETAINER', approvedImageCount: 72, includeUpsellDrafts: true });
  return (
    <main>
      <PageHeader
        eyebrow="Branded reports"
        title="White-label report drafts"
        description="Agency-branded delivery, quality, launch, and monthly-retainer reports that must exclude private data and unsafe guarantees."
      />
      <div className="space-y-6">
        <AgencyBrandedReportPanel report={report} />
        <AgencyGuardrailPanel />
      </div>
    </main>
  );
}
