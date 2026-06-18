import { buildSecuritySecretReferenceDraft } from '@/server/services/secret-reference-service';
import { buildHashedSecurityTokenDraft, evaluateSecurityTokenRecord } from '@/server/services/security-token-guard-service';

export function SecretTokenSecurityPanel() {
  const secretRef = buildSecuritySecretReferenceDraft({ organizationId: 'org_demo', provider: 'stripe', secretClass: 'PAYMENT_PROVIDER_KEY', label: 'Stripe secret key reference', metadata: { mode: 'disabled_by_default' } });
  const tokenDraft = buildHashedSecurityTokenDraft({ organizationId: 'org_demo', tokenKind: 'DELIVERY', resourceId: 'delivery_demo', expiresInMinutes: 60 * 24 * 7, approvedOnly: true, scope: { jobId: 'job_demo', clientId: 'client_demo' } });
  const tokenEvaluation = evaluateSecurityTokenRecord({ tokenKind: 'DELIVERY', tokenHash: tokenDraft.recordDraft.tokenHash, expiresAt: tokenDraft.recordDraft.expiresAt, approvedOnly: true, organizationId: 'org_demo', clientId: 'client_demo', jobId: 'job_demo' });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Secrets and token lifecycle</h2>
      <p className="mt-1 text-sm text-slate-600">Provider secrets are represented as encrypted references; delivery/upload/API/invite/portal tokens are represented as hashes with scope and expiry.</p>
      <div className="mt-4 space-y-4">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">Secret reference draft</p>
          <p className="mt-1 text-sm text-slate-600">{secretRef.secretClass} → {secretRef.encryptedSecretRef}</p>
          <p className="text-xs text-slate-500">Raw secret stored: {secretRef.rawSecretStored ? 'yes' : 'no'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">Delivery token draft</p>
          <p className="mt-1 text-sm text-slate-600">Hash present: {tokenEvaluation.hashPresent ? 'yes' : 'no'} · Accepted: {tokenEvaluation.accepted ? 'yes' : 'no'}</p>
          <p className="text-xs text-slate-500">Raw token is only represented in the one-time draft response; Codex must persist hash only.</p>
        </div>
      </div>
    </section>
  );
}
