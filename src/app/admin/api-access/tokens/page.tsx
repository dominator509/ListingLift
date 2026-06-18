import { ApiAccessShell } from '@/components/api-access';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 36"
        title="API token management"
        description="Create, revoke, rotate, and review API tokens. Raw tokens must be shown once only and stored as hashes."
      />
      <ApiAccessShell />
    </main>
  );
}
