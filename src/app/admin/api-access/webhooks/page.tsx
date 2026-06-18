import { ApiAccessShell } from '@/components/api-access';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 36"
        title="API webhook subscriptions"
        description="Outbound webhook scaffold with signing secret references, retry/dead-letter requirements, rate limits, and audit events."
      />
      <ApiAccessShell />
    </main>
  );
}
