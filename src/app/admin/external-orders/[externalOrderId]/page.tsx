import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';

export default async function ExternalOrderDetailPage({ params }: { params: Promise<{ externalOrderId: string }> }) {
  const { externalOrderId } = await params;
  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <PageHeader
        eyebrow="External order"
        title={externalOrderId}
        description="Detail shell for normalized external order, linked client, linked job, revenue attribution, raw payload redaction, and audit history."
      />
      <Card title="Codex wiring checkpoint">
        <p className="text-sm leading-6 text-slate-600">
          Phase 7 seed code defines the normalized shape and workflow. Codex must load this detail server-side with tenant isolation, RBAC, duplicate status, client/job links, and secret-safe payload display.
        </p>
      </Card>
    </main>
  );
}
