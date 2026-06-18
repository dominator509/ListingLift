import { SecurityHardeningShell } from '@/components/security-hardening';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 37"
        title="Webhook verification security"
        description="Focused Phase 37 shell for Stripe, Gumroad, automation, API, and future ecommerce webhook signature-verification contracts. Unsigned or unsupported events must remain manual-review only."
      />
      <SecurityHardeningShell />
    </main>
  );
}
