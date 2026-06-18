import { AgencyDashboardShell } from '@/components/agency-white-label';
import { PageHeader } from '@/components/ui/page-header';

export default function AgencyDashboardPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 35"
        title="Agency white-label dashboard"
        description="Multi-client agency workspace for branded delivery, branded reports, bulk processing queues, team access, billing, and volume pricing. Codex must enforce server-side agency scope, RBAC, tenant isolation, and approval gates before production use."
      />
      <AgencyDashboardShell />
    </main>
  );
}
