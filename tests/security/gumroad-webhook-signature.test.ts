import { describe, expect, it } from 'vitest';
import { computeGumroadWebhookSignature, verifyGumroadWebhookSignature } from '@/server/services/gumroad-webhook-signature-service';

describe('Gumroad webhook signature security', () => {
  it('verifies a matching HMAC signature', () => {
    const payload = 'sale_id=sale_123&email=buyer%40example.com';
    const secret = 'test_gumroad_secret';
    const signature = computeGumroadWebhookSignature(payload, secret);
    expect(verifyGumroadWebhookSignature({ payload, signatureHeader: signature, webhookSecret: secret }).ok).toBe(true);
  });

  it('rejects missing signatures when a secret is configured', () => {
    const result = verifyGumroadWebhookSignature({ payload: 'sale_id=sale_123', webhookSecret: 'secret' });
    expect(result.ok).toBe(false);
    expect(result.mode).toBe('missing_signature');
  });

  it('does not auto-verify when secret is missing', () => {
    const result = verifyGumroadWebhookSignature({ payload: 'sale_id=sale_123', signatureHeader: 'abc' });
    expect(result.ok).toBe(false);
    expect(result.mode).toBe('missing_secret');
  });
});
