import { AdvancedIntegrationCatalogPanel } from '@/components/api-access';
import { PageHeader } from '@/components/ui/page-header';

export default function Page() {
  return (
    <main>
      <PageHeader
        eyebrow="Phase 36"
        title="Advanced integration catalog"
        description="Zapier, Make, n8n, custom API client, and webhook scaffolds remain disabled by default until feature flags and encrypted secret references are verified."
      />
      <AdvancedIntegrationCatalogPanel />
    </main>
  );
}
