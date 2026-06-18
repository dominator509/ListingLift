import { Card } from '@/components/ui/card';

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-3xl font-semibold">Job Review</h1>
      <Card title="Implementation checkpoint">
        <p className="text-sm text-slate-600">
          This page shell is intentionally scaffolded for the roadmap phase that owns its data and actions. Codex must wire server-side auth, RBAC, tenant isolation, empty states, loading states, and tests before marking the owning phase complete.
        </p>
      </Card>
    </main>
  );
}
