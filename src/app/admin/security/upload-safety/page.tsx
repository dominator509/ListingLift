import { SecurityHardeningShell } from '@/components/security-hardening';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 37"
        title="Upload and ZIP safety"
        description="Focused Phase 37 shell for MIME and extension allowlists, size ceilings, parseability checks, ZIP slip rejection, nested archive blocking, original preservation, and upload-token scope verification."
      />
      <SecurityHardeningShell />
    </main>
  );
}
