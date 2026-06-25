import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/ui/page-header';
import { DeliveryLinkManager } from '@/components/delivery/delivery-link-manager';
import { DeliveryEmailPreview } from '@/components/delivery/delivery-email-preview';
import { MarketplaceDeliveryMessagePanel } from '@/components/delivery/marketplace-delivery-message-panel';
import { DownloadTrackingTable } from '@/components/delivery/download-tracking-table';

export default async function AdminDeliverySendPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;

  return (
    <AppShell variant="admin" navItems={[]}>
      <PageHeader title="Send delivery" description={`Prepare secure delivery link, email, marketplace copy, and tracking for ${jobId}.`} />
      <div className="grid gap-6">
        <DeliveryLinkManager />
        <DeliveryEmailPreview />
        <MarketplaceDeliveryMessagePanel />
        <DownloadTrackingTable />
      </div>
    </AppShell>
  );
}
