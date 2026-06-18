import { PageHeader } from '@/components/ui/page-header';
import { AdminPackageTable } from '@/components/packages';
import { Card } from '@/components/ui/card';

export default function AdminPackagesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHeader
        eyebrow="Admin"
        title="Packages and pricing"
        description="Manage package records, checkout modes, image allowances, revision allowances, sales-channel mappings, and marketplace-safe claims. Runtime persistence and audit logging must be wired by Codex against Prisma."
      />
      <AdminPackageTable />
      <div className="mt-6">
        <Card title="Codex implementation checkpoint" description="Admin editing must require manage:packages, persist to Package records, audit every change, and never rely on frontend-only pricing.">
          <p className="text-sm text-slate-600">Phase 5 seed provides server-side schemas and route contracts. Codex must connect these contracts to Prisma in the target repo and verify tests.</p>
        </Card>
      </div>
    </main>
  );
}
