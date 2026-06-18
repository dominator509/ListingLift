import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import type { buildAgencyQueueRows } from '@/server/services/agency-bulk-queue-service';

type AgencyQueueRow = ReturnType<typeof buildAgencyQueueRows>[number];

export function AgencyBulkQueuePanel({ items }: { items: AgencyQueueRow[] }) {
  return (
    <Card title="Bulk processing queue" description="Multi-client agency queue for package batches, priority work, review blockers, and delivery readiness.">
      <DataTable
        rows={items}
        getRowKey={(item) => item.id}
        emptyTitle="No bulk queue items yet"
        emptyDescription="Queue items will appear after Codex wires workspace jobs and bulk processing batches."
        columns={[
          { key: 'job', header: 'Job', render: (item) => <div><p className="font-medium text-slate-950">{item.jobTitle}</p><p className="text-xs text-slate-500">{item.clientName} · {item.packageName ?? 'Custom pack'}</p></div> },
          { key: 'status', header: 'Status', render: (item) => <Badge tone={item.statusTone}>{item.status.replaceAll('_', ' ')}</Badge> },
          { key: 'images', header: 'Images', render: (item) => item.imageCount },
          { key: 'priority', header: 'Priority', render: (item) => <Badge tone={item.priority === 'URGENT' || item.priority === 'HIGH' ? 'amber' : 'slate'}>{item.priority}</Badge> },
          { key: 'review', header: 'Review', render: (item) => item.requiresManualReview ? <Badge tone="red">Manual review</Badge> : <Badge tone="green">Queued gate</Badge> },
        ]}
      />
    </Card>
  );
}
