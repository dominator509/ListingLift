import { SecuritySummaryCards } from './security-summary-cards';
import { SecurityControlTable } from './security-control-table';
import { UploadSecurityPanel } from './upload-security-panel';
import { SecretTokenSecurityPanel } from './secret-token-security-panel';
import { RateLimitSecurityPanel } from './rate-limit-security-panel';
import { HeaderCsrfXssPanel } from './header-csrf-xss-panel';
import { WebhookAuditSecurityPanel } from './webhook-audit-security-panel';
import { SecurityGuardrailPanel } from './security-guardrail-panel';
import { buildSecurityDashboardSnapshot } from '@/server/services/security-dashboard-service';

export function SecurityHardeningShell() {
  const snapshot = buildSecurityDashboardSnapshot();
  return (
    <div className="space-y-8">
      <SecuritySummaryCards summary={snapshot.summary} />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <UploadSecurityPanel />
        <SecretTokenSecurityPanel />
        <RateLimitSecurityPanel />
        <HeaderCsrfXssPanel />
      </div>
      <WebhookAuditSecurityPanel />
      <SecurityControlTable controls={snapshot.controls} />
      <SecurityGuardrailPanel />
    </div>
  );
}
