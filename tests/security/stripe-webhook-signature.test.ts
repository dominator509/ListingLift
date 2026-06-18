import { describe, expect, it } from 'vitest';
import { computeStripeSignature, verifyStripeWebhookSignature } from '@/server/services/stripe-webhook-signature-service';

describe('stripe webhook signature verification', () => {
  it('accepts valid signed payloads', () => {
    const payload = JSON.stringify({ id: 'evt_123', type: 'checkout.session.completed', data: { object: {} } });
    const timestamp = 1_700_000_000;
    const secret = 'whsec_test_secret';
    const signature = computeStripeSignature(payload, timestamp, secret);
    const result = verifyStripeWebhookSignature({ payload, signatureHeader: `t=${timestamp},v1=${signature}`, webhookSecret: secret, nowSeconds: timestamp });
    expect(result.ok).toBe(true);
  });

  it('rejects mismatched signatures', () => {
    const payload = '{"id":"evt_bad"}';
    const result = verifyStripeWebhookSignature({ payload, signatureHeader: 't=1700000000,v1=deadbeef', webhookSecret: 'whsec_test_secret', nowSeconds: 1700000000 });
    expect(result.ok).toBe(false);
  });
});
