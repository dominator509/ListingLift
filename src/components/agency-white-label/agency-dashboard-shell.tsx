import { AgencyBillingVolumePanel } from './agency-billing-volume-panel';
import { AgencyBrandedDeliveryPanel } from './agency-branded-delivery-panel';
import { AgencyBrandedReportPanel } from './agency-branded-report-panel';
import { AgencyBulkQueuePanel } from './agency-bulk-queue-panel';
import { AgencyGuardrailPanel } from './agency-guardrail-panel';
import { AgencySummaryCards } from './agency-summary-cards';
import { AgencyTeamTable } from './agency-team-table';
import { AgencyWhiteLabelSettingsPanel } from './agency-white-label-settings-panel';
import { AgencyWorkspaceTable } from './agency-workspace-table';
import { buildAgencyVolumePricingQuote } from '@/server/services/agency-billing-service';
import { buildAgencyQueueRows } from '@/server/services/agency-bulk-queue-service';
import { buildAgencyDashboardSummary } from '@/server/services/agency-dashboard-summary-service';
import { buildAgencyTeamRows } from '@/server/services/agency-team-service';
import { buildAgencyBrandedDeliveryDraft, buildAgencyBrandedReportDraft, buildAgencyWhiteLabelSettingsPreview, demoAgencyBrandSettings } from '@/server/services/agency-white-label-settings-service';
import { buildAgencyWorkspaceRows } from '@/server/services/agency-workspace-service';

export function AgencyDashboardShell() {
  const summary = buildAgencyDashboardSummary();
  const workspaces = buildAgencyWorkspaceRows();
  const queueItems = buildAgencyQueueRows();
  const settings = buildAgencyWhiteLabelSettingsPreview(demoAgencyBrandSettings);
  const deliveryDraft = buildAgencyBrandedDeliveryDraft({ clientName: 'Aster Handmade', packageName: 'Marketplace Listing Pack', approvedFileCount: 48, expiresInDays: 7, includeReportLink: true });
  const reportDraft = buildAgencyBrandedReportDraft({ clientName: 'Aster Handmade', reportType: 'MONTHLY_RETAINER', approvedImageCount: 72, includeUpsellDrafts: true });
  const quote = buildAgencyVolumePricingQuote({ monthlyImageVolume: summary.workspaces.monthlyImageVolume, workspaceCount: summary.workspaces.totalWorkspaces, rushQueueEnabled: true, brandedReportsEnabled: true, apiAccessRequested: false, currency: 'USD' });
  const team = buildAgencyTeamRows();
  return (
    <div className="space-y-8">
      <AgencySummaryCards activeWorkspaces={summary.workspaces.activeWorkspaces} monthlyImageVolume={summary.workspaces.monthlyImageVolume} inProduction={summary.queue.inProduction} readyForDelivery={summary.queue.readyForDelivery} />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <AgencyWorkspaceTable workspaces={workspaces} />
          <AgencyBulkQueuePanel items={queueItems} />
          <AgencyTeamTable members={team} />
        </div>
        <div className="space-y-6">
          <AgencyWhiteLabelSettingsPanel settings={settings} />
          <AgencyBrandedDeliveryPanel draft={deliveryDraft} />
          <AgencyBrandedReportPanel report={reportDraft} />
          <AgencyBillingVolumePanel quote={quote} />
        </div>
      </div>
      <AgencyGuardrailPanel />
    </div>
  );
}
