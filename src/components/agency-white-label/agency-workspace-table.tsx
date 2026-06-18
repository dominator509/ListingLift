import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import type { buildAgencyWorkspaceRows } from '@/server/services/agency-workspace-service';

type AgencyWorkspaceRow = ReturnType<typeof buildAgencyWorkspaceRows>[number];

export function AgencyWorkspaceTable({ workspaces }: { workspaces: AgencyWorkspaceRow[] }) {
  return (
    <Card title="Client workspaces" description="Agency-scoped workspaces for ecommerce clients, branded reports, active jobs, and volume usage.">
      <DataTable
        rows={workspaces}
        getRowKey={(workspace) => workspace.id}
        emptyTitle="No agency workspaces yet"
        emptyDescription="Codex must load client workspaces from tenant-scoped Prisma records."
        columns={[
          { key: 'workspace', header: 'Workspace', render: (workspace) => <div><p className="font-medium text-slate-950">{workspace.label}</p><p className="text-xs text-slate-500">{workspace.sourceChannels.join(', ') || 'Manual intake'}</p></div> },
          { key: 'status', header: 'Status', render: (workspace) => <Badge tone={workspace.statusTone}>{workspace.status.replaceAll('_', ' ')}</Badge> },
          { key: 'jobs', header: 'Jobs', render: (workspace) => <span>{workspace.activeJobs} active / {workspace.completedJobs} completed</span> },
          { key: 'volume', header: 'Monthly volume', render: (workspace) => workspace.monthlyImageVolume },
          { key: 'branding', header: 'Branding', render: (workspace) => <div className="flex flex-wrap gap-2"><Badge tone={workspace.whiteLabelEnabled ? 'purple' : 'slate'}>{workspace.whiteLabelEnabled ? 'White-label' : 'Standard'}</Badge>{workspace.brandedReportsEnabled ? <Badge tone="blue">Reports</Badge> : null}</div> },
        ]}
      />
    </Card>
  );
}
