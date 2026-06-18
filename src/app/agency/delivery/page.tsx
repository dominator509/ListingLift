import { AgencyBrandedDeliveryPanel, AgencyGuardrailPanel } from '@/components/agency-white-label';
import { PageHeader } from '@/components/ui/page-header';
import { buildAgencyBrandedDeliveryDraft } from '@/server/services/agency-white-label-settings-service';

export default function AgencyDeliveryPage() {
  const draft = buildAgencyBrandedDeliveryDraft({ clientName: 'Northstar Goods', packageName: 'Product Launch Image Pack', approvedFileCount: 96, expiresInDays: 7, includeReportLink: true });
  return (
    <main>
      <PageHeader
        eyebrow="Branded delivery"
        title="Agency delivery page preview"
        description="White-label delivery scaffolds for approved client outputs. Production delivery must use hashed expiring tokens, download limits, QC/manual approval gates, and original-upload preservation."
      />
      <div className="space-y-6">
        <AgencyBrandedDeliveryPanel draft={draft} />
        <AgencyGuardrailPanel />
      </div>
    </main>
  );
}
