import { AgencyGuardrailPanel, AgencyWorkspaceTable } from '@/components/agency-white-label';
import { PageHeader } from '@/components/ui/page-header';
import { buildAgencyWorkspaceRows } from '@/server/services/agency-workspace-service';

export default function AgencyWorkspacesPage() {
  const workspaces = buildAgencyWorkspaceRows();
  return (
    <main>
      <PageHeader
        eyebrow="Agency workspaces"
        title="Client workspaces"
        description="White-label-ready client workspaces grouped by active agency organization, source channels, active jobs, branded reports, and monthly image volume."
      />
      <div className="space-y-6">
        <AgencyWorkspaceTable workspaces={workspaces} />
        <AgencyGuardrailPanel />
      </div>
    </main>
  );
}
