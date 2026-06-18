import { SecurityHardeningShell } from '@/components/security-hardening';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 37"
        title="Secrets and token lifecycle"
        description="Focused Phase 37 shell for encrypted secret references, raw-secret rejection, hashed upload/delivery/API/invite/portal token drafts, expiry, revocation, and no frontend secret exposure."
      />
      <SecurityHardeningShell />
    </main>
  );
}
