import { AgencyBillingVolumePanel, AgencyGuardrailPanel } from '@/components/agency-white-label';
import { PageHeader } from '@/components/ui/page-header';
import { buildAgencyVolumePricingQuote } from '@/server/services/agency-billing-service';

export default function AgencyVolumePricingPage() {
  const quote = buildAgencyVolumePricingQuote({ monthlyImageVolume: 1200, workspaceCount: 6, rushQueueEnabled: true, brandedReportsEnabled: true, apiAccessRequested: false, currency: 'USD' });
  return (
    <main>
      <PageHeader
        eyebrow="Volume pricing"
        title="Agency volume pricing scaffold"
        description="Quote high-volume white-label fulfillment plans by monthly image volume, workspace count, rush queue needs, branded reports, and optional API access."
      />
      <div className="space-y-6">
        <AgencyBillingVolumePanel quote={quote} />
        <AgencyGuardrailPanel />
      </div>
    </main>
  );
}
