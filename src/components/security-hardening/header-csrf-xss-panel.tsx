import { getSecurityHeaderPolicyRows } from '@/server/services/security-headers-service';
import { createCsrfTokenDraft, verifyCsrfTokenDraft } from '@/server/services/csrf-protection-service';
import { buildSafeOutputPreview } from '@/server/services/xss-output-protection-service';

export function HeaderCsrfXssPanel() {
  const headers = getSecurityHeaderPolicyRows('production');
  const csrf = createCsrfTokenDraft({ sessionId: 'session_demo_123456', organizationId: 'org_demo', csrfSecret: 'replace-with-real-32-character-csrf-secret', expiresInMinutes: 120 });
  const csrfCheck = verifyCsrfTokenDraft({ sessionId: 'session_demo_123456', organizationId: 'org_demo', csrfSecret: 'replace-with-real-32-character-csrf-secret', token: csrf.token });
  const safeOutput = buildSafeOutputPreview('Clean product image pack prepared for seller review.');

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Headers, CSRF, and XSS protection</h2>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">Security headers</p>
          <p className="mt-2 text-sm text-slate-600">{headers.length} draft headers, including CSP, nosniff, referrer policy, frame protection, and production HSTS.</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">CSRF draft</p>
          <p className="mt-2 text-sm text-slate-600">Verification: {csrfCheck.ok ? 'valid' : 'invalid'}</p>
          <p className="text-xs text-slate-500">Codex must wire session-bound checks to state-changing browser routes.</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">XSS/safe copy</p>
          <p className="mt-2 text-sm text-slate-600">Escaped preview: {safeOutput.escapedHtml}</p>
          <p className="text-xs text-slate-500">CSV formula neutralization and no-guarantee copy checks included.</p>
        </div>
      </div>
    </section>
  );
}
