import { AgencyBrandedDeliveryPanel, AgencyBrandedReportPanel, AgencyGuardrailPanel, AgencyWhiteLabelSettingsPanel } from '@/components/agency-white-label';
import { PageHeader } from '@/components/ui/page-header';
import { buildAgencyBrandedDeliveryDraft, buildAgencyBrandedReportDraft, buildAgencyWhiteLabelSettingsPreview, demoAgencyBrandSettings } from '@/server/services/agency-white-label-settings-service';

export default function AgencyWhiteLabelSettingsPage() {
  const settings = buildAgencyWhiteLabelSettingsPreview(demoAgencyBrandSettings);
  const deliveryDraft = buildAgencyBrandedDeliveryDraft({ clientName: 'Aster Handmade', packageName: 'Marketplace Listing Pack', approvedFileCount: 48, expiresInDays: 7, includeReportLink: true });
  const reportDraft = buildAgencyBrandedReportDraft({ clientName: 'Aster Handmade', reportType: 'DELIVERY_SUMMARY', approvedImageCount: 48, includeUpsellDrafts: false });
  return (
    <main>
      <PageHeader
        eyebrow="White-label settings"
        title="Brand kit, delivery, and report previews"
        description="Draft the agency portal identity, branded delivery page, branded reports, support identity, custom domain, and footer copy. Client-facing use requires Codex-wired approval and security gates."
      />
      <div className="space-y-6">
        <AgencyWhiteLabelSettingsPanel settings={settings} />
        <AgencyBrandedDeliveryPanel draft={deliveryDraft} />
        <AgencyBrandedReportPanel report={reportDraft} />
        <AgencyGuardrailPanel />
      </div>
    </main>
  );
}
