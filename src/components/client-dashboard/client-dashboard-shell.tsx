import { ClientBillingPanel } from './client-billing-panel';
import { ClientDashboardSummaryCards } from './client-dashboard-summary-cards';
import { ClientDownloadPanel } from './client-download-panel';
import { ClientJobList } from './client-job-list';
import { ClientPreviewPanel } from './client-preview-panel';
import { ClientRevisionPanel } from './client-revision-panel';
import { ClientUploadPanel } from './client-upload-panel';
import { ClientUpgradePanel } from './client-upgrade-panel';

export function ClientDashboardShell() {
  const demoJobs = [
    { id: 'demo-client-job-1', jobNumber: 'LL-DEMO-001', title: 'Demo Marketplace Listing Pack', status: 'WAITING_FOR_REVIEW', packageName: 'Marketplace Listing Pack', targetPlatform: 'Etsy + Shopify', readyDownloads: 0, approvedPreviewCount: 8, openRevisionCount: 0 },
    { id: 'demo-client-job-2', jobNumber: 'LL-DEMO-002', title: 'Demo Completed Pack', status: 'DELIVERED', packageName: 'Quick Cleanup Pack', targetPlatform: 'Amazon draft', readyDownloads: 1, approvedPreviewCount: 10, openRevisionCount: 0 },
  ];
  return (
    <div className="space-y-8">
      <ClientDashboardSummaryCards activeJobs={1} readyDownloads={1} openRevisions={0} creditsRemaining={25} />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <ClientJobList jobs={demoJobs} />
          <ClientPreviewPanel />
          <ClientDownloadPanel />
        </div>
        <div className="space-y-6">
          <ClientUploadPanel />
          <ClientRevisionPanel />
          <ClientBillingPanel creditsRemaining={25} subscriptionStatus="Demo retainer scaffold" />
          <ClientUpgradePanel />
        </div>
      </div>
    </div>
  );
}
