import { AdvancedIntegrationCatalogPanel } from './advanced-integration-catalog-panel';
import { ApiGuardrailPanel } from './api-guardrail-panel';
import { ApiPlanGatePanel } from './api-plan-gate-panel';
import { ApiScopeMatrixPanel } from './api-scope-matrix-panel';
import { ApiAccessSummaryCards } from './api-access-summary-cards';
import { ApiTokenTable } from './api-token-table';
import { ApiWebhookManagementPanel } from './api-webhook-management-panel';
import { SharedUploadPortalPanel } from './shared-upload-portal-panel';
import { buildApiAccessDashboardSummary, buildApiTokenRows, buildApiWebhookRows, buildSharedUploadPortalRows } from '@/server/services/api-access-dashboard-service';

export function ApiAccessShell() {
  const summary = buildApiAccessDashboardSummary();
  const tokens = buildApiTokenRows();
  const webhooks = buildApiWebhookRows();
  const portals = buildSharedUploadPortalRows();
  return (
    <div className="space-y-8">
      <ApiAccessSummaryCards activeTokens={summary.tokens.activeTokens} usedTokenCount={summary.tokens.usedTokenCount} activeWebhookDrafts={summary.activeWebhookDrafts} sharedPortalDrafts={summary.sharedPortalDrafts} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <div className="space-y-6">
          <ApiTokenTable tokens={tokens} />
          <AdvancedIntegrationCatalogPanel />
          <ApiWebhookManagementPanel webhooks={webhooks} />
        </div>
        <div className="space-y-6">
          <ApiPlanGatePanel />
          <ApiScopeMatrixPanel planKey="AGENCY" />
          <SharedUploadPortalPanel portals={portals} />
        </div>
      </div>
      <ApiGuardrailPanel />
    </div>
  );
}
