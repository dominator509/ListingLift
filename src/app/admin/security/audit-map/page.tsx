import { SecurityHardeningShell } from '@/components/security-hardening';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 37"
        title="Audit completeness map"
        description="Focused Phase 37 shell mapping sensitive paid, client-facing, manual override, RBAC, token, webhook, secret, upload, and delivery actions to sanitized audit events."
      />
      <SecurityHardeningShell />
    </main>
  );
}
