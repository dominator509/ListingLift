import { ClientDashboardShell } from '@/components/client-dashboard';
import { PageHeader } from '@/components/ui/page-header';

export default function ClientDashboardPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Client dashboard"
        title="Your ListingLift image workspace"
        description="Track uploads, active jobs, approved previews, final downloads, revisions, billing, credits, and upgrade options from a client-scoped dashboard. All data must be loaded server-side with tenant and client isolation."
      />
      <ClientDashboardShell />
    </main>
  );
}
