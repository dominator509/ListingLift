import { ApiScopeMatrixPanel } from '@/components/api-access';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 36"
        title="API scope matrix"
        description="Review Phase 36 scopes and plan gates for jobs, uploads, images, deliveries, webhooks, and presets."
      />
      <ApiScopeMatrixPanel />
    </main>
  );
}
