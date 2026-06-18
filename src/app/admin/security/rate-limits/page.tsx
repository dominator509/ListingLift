import { SecurityHardeningShell } from '@/components/security-hardening';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 37"
        title="Sensitive-route rate limits"
        description="Focused Phase 37 shell for login, upload, checkout, webhook, processing, download, API, shared portal, token management, and manual override rate-limit policies."
      />
      <SecurityHardeningShell />
    </main>
  );
}
