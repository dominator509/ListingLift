import { ApiAccessShell } from '@/components/api-access';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 36"
        title="Shared upload portal scaffold"
        description="Agency/API upload intake portals with hashed expiring tokens, original-upload preservation, unsafe file rejection, and manual review."
      />
      <ApiAccessShell />
    </main>
  );
}
