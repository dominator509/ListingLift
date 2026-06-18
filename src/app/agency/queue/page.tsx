import { AgencyBulkQueuePanel, AgencyGuardrailPanel } from '@/components/agency-white-label';
import { PageHeader } from '@/components/ui/page-header';
import { buildAgencyQueueRows } from '@/server/services/agency-bulk-queue-service';

export default function AgencyQueuePage() {
  const items = buildAgencyQueueRows();
  return (
    <main>
      <PageHeader
        eyebrow="Agency bulk queue"
        title="Bulk processing queue"
        description="Plan multi-client product image batches, status buckets, manual-review blockers, priority work, and approval-gated delivery."
      />
      <div className="space-y-6">
        <AgencyBulkQueuePanel items={items} />
        <AgencyGuardrailPanel />
      </div>
    </main>
  );
}
