import { describe, expect, it } from 'vitest';
import { buildSecuritySecretReferenceDraft } from '@/server/services/secret-reference-service';
import { buildHashedSecurityTokenDraft, evaluateSecurityTokenRecord, redactTokenLikeRecord } from '@/server/services/security-token-guard-service';
import { buildWebhookVerificationDecision } from '@/server/services/security-webhook-verification-service';

const organizationId = 'org_security';

describe('phase37 security hardening controls', () => {
  it('creates secret references without raw secret persistence', () => {
    const draft = buildSecuritySecretReferenceDraft({ organizationId, provider: 'stripe', secretClass: 'PAYMENT_PROVIDER_KEY', label: 'Stripe key', metadata: { mode: 'disabled' } });
    expect(draft.rawSecretStored).toBe(false);
    expect(draft.encryptedSecretRef).toContain('enc_ref_');
  });

  it('creates hashed expiring token record drafts', () => {
    const issued = buildHashedSecurityTokenDraft({ organizationId, tokenKind: 'DELIVERY', resourceId: 'delivery_1', expiresInMinutes: 60, approvedOnly: true, scope: { jobId: 'job_1' } });
    expect(JSON.stringify(issued.recordDraft)).not.toContain(issued.rawToken);
    expect(issued.recordDraft.rawTokenStored).toBe(false);
    expect(evaluateSecurityTokenRecord({ tokenKind: 'DELIVERY', tokenHash: issued.recordDraft.tokenHash, expiresAt: issued.recordDraft.expiresAt, organizationId }).accepted).toBe(true);
  });

  it('redacts token-like record fields', () => {
    const redacted = redactTokenLikeRecord({ tokenHash: 'abc', normal: 'ok', authorizationHeader: 'Bearer raw' });
    expect(redacted.tokenHash).toBe('[redacted]');
    expect(redacted.authorizationHeader).toBe('[redacted]');
    expect(redacted.normal).toBe('ok');
  });

  it('does not auto-process webhook probes without verified signatures', () => {
    const decision = buildWebhookVerificationDecision({ provider: 'STRIPE', payload: '{}', secretConfigured: true, signatureHeader: null });
    expect(decision.canAutoProcess).toBe(false);
    expect(decision.reason).toBe('missing_signature_header');
  });
});
