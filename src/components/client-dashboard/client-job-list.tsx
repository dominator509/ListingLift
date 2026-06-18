import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import type { ClientDashboardJobRow } from '@/server/services/client-dashboard-job-service';

export function ClientJobList({ jobs }: { jobs: ClientDashboardJobRow[] }) {
  return (
    <Card title="Your jobs" description="Client-scoped job list. Codex must load only jobs for the active client membership.">
      <DataTable
        rows={jobs}
        getRowKey={(job) => job.id}
        emptyTitle="No client jobs yet"
        emptyDescription="Jobs will appear after checkout, sales-channel intake, or manual order creation."
        columns={[
          { key: 'job', header: 'Job', render: (job) => <div><p className="font-medium text-slate-950">{job.title}</p><p className="text-xs text-slate-500">{job.jobNumber ?? job.id}</p></div> },
          { key: 'status', header: 'Status', render: (job) => <Badge tone={job.status.includes('DELIVER') || job.status.includes('COMPLETED') ? 'green' : job.status.includes('FLAG') || job.status.includes('FAILED') ? 'red' : 'blue'}>{job.status.replaceAll('_', ' ')}</Badge> },
          { key: 'package', header: 'Package', render: (job) => job.packageName ?? '—' },
          { key: 'platform', header: 'Platform', render: (job) => job.targetPlatform ?? 'Seller review' },
          { key: 'downloads', header: 'Downloads', render: (job) => job.readyDownloads ?? 0 },
        ]}
      />
    </Card>
  );
}
