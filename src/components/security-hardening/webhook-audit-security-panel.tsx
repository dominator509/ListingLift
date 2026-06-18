import { buildWebhookVerificationDecision, requiredWebhookHeaders } from '@/server/services/security-webhook-verification-service';
import { buildSecurityAuditCompletenessSummary, getSecurityAuditCoverageRows } from '@/server/services/audit-completeness-map-service';

export function WebhookAuditSecurityPanel() {
  const stripeDecision = buildWebhookVerificationDecision({ provider: 'STRIPE', payload: '{"id":"evt_demo"}', signatureHeader: null, secretConfigured: true, eventId: 'evt_demo' });
  const auditSummary = buildSecurityAuditCompletenessSummary();
  const rows = getSecurityAuditCoverageRows().slice(0, 5);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Webhook verification and audit completeness</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.2fr]">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">Webhook decision</p>
          <p className="mt-2 text-sm text-slate-600">Provider: {stripeDecision.provider}</p>
          <p className="text-sm text-slate-600">Can auto-process: {stripeDecision.canAutoProcess ? 'yes' : 'no'}</p>
          <p className="text-xs text-slate-500">Required headers: {requiredWebhookHeaders('STRIPE').join(', ')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">Audit map</p>
          <p className="mt-2 text-sm text-slate-600">{auditSummary.totalSensitiveActions} sensitive actions mapped; {auditSummary.codexRequired} still require runtime wiring.</p>
          <ul className="mt-3 space-y-2 text-xs text-slate-600">
            {rows.map((row) => <li key={row.action}><span className="font-semibold text-slate-800">{row.eventType}</span> · {row.surface}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
