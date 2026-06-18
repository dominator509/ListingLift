import { SECURITY_RATE_LIMIT_ACTIONS } from '@/domain/security-hardening';
import { evaluateSecurityRateLimit } from '@/server/services/security-rate-limit-policy-service';

export function RateLimitSecurityPanel() {
  const rows = SECURITY_RATE_LIMIT_ACTIONS.map((action) => evaluateSecurityRateLimit({ action, subjectParts: { organizationId: 'org_demo', actor: 'actor_demo' }, observedCount: 0 }));
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Sensitive-route rate limits</h2>
      <p className="mt-1 text-sm text-slate-600">Policies are scaffolded for login, upload, checkout, webhooks, processing, downloads, API, token management, shared portals, and manual overrides.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="px-4 py-3">Action</th><th className="px-4 py-3">Limit</th><th className="px-4 py-3">Window</th><th className="px-4 py-3">Subject</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => <tr key={row.action}><td className="px-4 py-3 font-medium text-slate-950">{row.action}</td><td className="px-4 py-3 text-slate-700">{row.limit}</td><td className="px-4 py-3 text-slate-700">{row.windowSeconds}s</td><td className="px-4 py-3 text-slate-600">{row.subject}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
