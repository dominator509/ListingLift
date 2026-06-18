import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import type { buildAgencyTeamRows } from '@/server/services/agency-team-service';

type AgencyTeamRow = ReturnType<typeof buildAgencyTeamRows>[number];

export function AgencyTeamTable({ members }: { members: AgencyTeamRow[] }) {
  return (
    <Card title="Team members" description="Agency-scoped team access. Invites must use expiring hashed tokens and role-scoped permissions.">
      <DataTable
        rows={members}
        getRowKey={(member) => member.id}
        emptyTitle="No agency team members yet"
        emptyDescription="Codex must load memberships from tenant-scoped records."
        columns={[
          { key: 'member', header: 'Member', render: (member) => <div><p className="font-medium text-slate-950">{member.name}</p><p className="text-xs text-slate-500">{member.email}</p></div> },
          { key: 'role', header: 'Role', render: (member) => <Badge tone="blue">{member.role.replaceAll('_', ' ')}</Badge> },
          { key: 'status', header: 'Status', render: (member) => <Badge tone={member.status === 'ACTIVE' ? 'green' : member.status === 'SUSPENDED' ? 'red' : 'amber'}>{member.status}</Badge> },
          { key: 'workspaces', header: 'Workspaces', render: (member) => member.clientWorkspaceCount },
          { key: 'security', header: 'Security', render: () => <Badge tone="purple">Server RBAC required</Badge> },
        ]}
      />
    </Card>
  );
}
