import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/ui/page-header';
import { DeliveryLinkManager } from '@/components/delivery/delivery-link-manager';
import { DeliveryEmailPreview } from '@/components/delivery/delivery-email-preview';
import { MarketplaceDeliveryMessagePanel } from '@/components/delivery/marketplace-delivery-message-panel';
import { DownloadTrackingTable } from '@/components/delivery/download-tracking-table';

export default function AdminDeliverySendPage({ params }: { params: { jobId: string } }) {
  return (
    <AppShell variant="admin" navItems={[]}>
      <PageHeader title="Send delivery" description={`Prepare secure delivery link, email, marketplace copy, and tracking for ${params.jobId}.`} />
      <div className="grid gap-6">
        <DeliveryLinkManager />
        <DeliveryEmailPreview />
        <MarketplaceDeliveryMessagePanel />
        <DownloadTrackingTable />
      </div>
    </AppShell>
  );
}
