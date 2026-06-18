import { AGENCY_WHITE_LABEL_SAFE_COPY, quoteAgencyVolumePricing, summarizeAgencyQueue, summarizeAgencyWorkspaces } from '@/domain/agency-white-label';
import { demoAgencyQueueItems } from '@/server/services/agency-bulk-queue-service';
import { demoAgencyWorkspaces } from '@/server/services/agency-workspace-service';

export function buildAgencyDashboardSummary() {
  const workspaceSummary = summarizeAgencyWorkspaces(demoAgencyWorkspaces);
  const queueSummary = summarizeAgencyQueue(demoAgencyQueueItems);
  const volumeQuote = quoteAgencyVolumePricing({ monthlyImageVolume: workspaceSummary.monthlyImageVolume, workspaceCount: workspaceSummary.totalWorkspaces, brandedReportsEnabled: true, rushQueueEnabled: true });
  return {
    workspaces: workspaceSummary,
    queue: queueSummary,
    billing: {
      tierLabel: volumeQuote.tierLabel,
      estimatedMonthlyCents: volumeQuote.estimatedMonthlyCents,
      formattedEstimatedMonthly: volumeQuote.formattedEstimatedMonthly,
      manualReviewRequired: true,
    },
    brand: {
      whiteLabelWorkspaces: workspaceSummary.whiteLabelWorkspaces,
      brandedReportWorkspaces: workspaceSummary.brandedReportWorkspaces,
      manualReviewRequired: true,
    },
    notices: AGENCY_WHITE_LABEL_SAFE_COPY,
    dryRun: true,
  };
}
