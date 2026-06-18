import { PageHeader } from '@/components/ui';
import { ClientScopeCard, RoleMatrixCard } from '@/components/rbac';

export default function AdminRbacPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        eyebrow="Access control"
        title="Tenant, client, and role controls"
        description="Review the ListingLift RBAC matrix and the server-side scoping rules Codex must enforce before production."
      />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <RoleMatrixCard />
        <ClientScopeCard />
      </div>
    </main>
  );
}
