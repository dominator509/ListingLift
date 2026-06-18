import { ApiAccessShell } from '@/components/api-access';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 36"
        title="API access and advanced integrations"
        description="Admin shell for API tokens, scope enforcement, plan gates, shared upload portals, and Zapier/Make/n8n/custom API scaffolds. Codex must wire hashed-token persistence, RBAC, tenant isolation, rate limits, and audits."
      />
      <ApiAccessShell />
    </main>
  );
}
