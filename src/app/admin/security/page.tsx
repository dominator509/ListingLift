import { SecurityHardeningShell } from '@/components/security-hardening';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 37"
        title="Security hardening"
        description="Admin command center for secrets, upload safety, ZIP slip prevention, hashed expiring tokens, rate limits, security headers, CSRF/XSS protection, webhook verification, audit completeness, and server-side RBAC/tenant isolation."
      />
      <SecurityHardeningShell />
    </main>
  );
}
