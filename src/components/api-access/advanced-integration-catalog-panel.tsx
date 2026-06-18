import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { listAdvancedIntegrationCatalog } from '@/server/services/advanced-integration-catalog-service';

export function AdvancedIntegrationCatalogPanel() {
  const catalog = listAdvancedIntegrationCatalog();
  return (
    <Card title="Advanced integrations" description="Zapier, Make, n8n, custom API clients, and webhook workflows stay disabled by default until feature flags and encrypted secret references are wired.">
      <div className="grid gap-3 lg:grid-cols-2">
        {catalog.map((item) => (
          <div key={item.provider} className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-slate-950">{item.label}</p>
              <Badge tone="amber">disabled by default</Badge>
            </div>
            <p className="mt-2 text-xs text-slate-500">Feature flag: {item.featureFlagKey}</p>
            <p className="mt-3 text-sm text-slate-600">Triggers: {item.triggers.join(', ')}</p>
            <p className="mt-2 text-sm text-slate-600">Actions: {item.actions.join(', ')}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
