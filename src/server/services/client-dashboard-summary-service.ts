import { CLIENT_DASHBOARD_SAFE_COPY } from '@/domain/client-dashboard';

export type ClientDashboardSummaryInput = {
  clientId?: string | null;
  activeJobs?: number;
  completedJobs?: number;
  waitingForUpload?: number;
  waitingForReview?: number;
  readyDownloads?: number;
  openRevisions?: number;
  creditsRemaining?: number;
  creditsTotal?: number;
  subscriptionStatus?: string | null;
  upsellOpportunities?: number;
  approvedReports?: number;
};

export function buildClientDashboardSummary(input: ClientDashboardSummaryInput = {}) {
  const creditsRemaining = input.creditsRemaining ?? 0;
  const creditsTotal = input.creditsTotal ?? 0;
  return {
    clientId: input.clientId ?? null,
    metrics: {
      activeJobs: input.activeJobs ?? 0,
      completedJobs: input.completedJobs ?? 0,
      waitingForUpload: input.waitingForUpload ?? 0,
      waitingForReview: input.waitingForReview ?? 0,
      readyDownloads: input.readyDownloads ?? 0,
      openRevisions: input.openRevisions ?? 0,
      approvedReports: input.approvedReports ?? 0,
    },
    billing: {
      creditsRemaining,
      creditsTotal,
      creditUsagePercent: creditsTotal > 0 ? Math.round(((creditsTotal - creditsRemaining) / creditsTotal) * 100) : 0,
      subscriptionStatus: input.subscriptionStatus ?? 'manual-or-unconfigured',
    },
    opportunities: {
      upsellOpportunities: input.upsellOpportunities ?? 0,
      upgradeMessage: CLIENT_DASHBOARD_SAFE_COPY.upgradeNotice,
    },
    notices: {
      preview: CLIENT_DASHBOARD_SAFE_COPY.previewNotice,
      marketplace: CLIENT_DASHBOARD_SAFE_COPY.marketplaceNotice,
      revisions: CLIENT_DASHBOARD_SAFE_COPY.revisionNotice,
    },
  };
}
