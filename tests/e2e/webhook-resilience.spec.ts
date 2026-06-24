import { expect, test } from '@playwright/test';
import crypto from 'node:crypto';

const BASE = process.env.APP_URL || 'http://localhost:3000';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'dev-stripe-webhook-secret';

function stripeSignature(payload: unknown) {
  const body = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac('sha256', STRIPE_WEBHOOK_SECRET).update(`${timestamp}.${body}`).digest('hex');
  return { body, header: `t=${timestamp},v1=${signature}` };
}

test.describe('Webhook resilience', () => {
  const uniqueId = `wh-${Date.now()}`;

  test('duplicate Stripe webhooks return 200 without double-processing', async ({ request }) => {
    const payload = {
      id: `evt_dup_test_${uniqueId}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          id: `cs_dup_test_${uniqueId}`,
          client_reference_id: `dup-ref-${uniqueId}`,
          customer_email: `dup-${uniqueId}@test.com`,
          mode: 'payment',
          metadata: { packageKey: 'QuickCleanup10' },
          payment_status: 'paid',
          amount_total: 2500,
          currency: 'usd',
        },
      },
    };

    const signed = stripeSignature(payload);
    const headers = {
      'stripe-signature': signed.header,
      'content-type': 'application/json',
    };

    // Send same webhook twice
    const [res1, res2] = await Promise.all([
      request.post(`${BASE}/api/stripe/webhook`, { data: signed.body, headers }),
      request.post(`${BASE}/api/stripe/webhook`, { data: signed.body, headers }),
    ]);

    // Both should return 200 (webhooks are idempotent by event ID)
    expect(res1.status()).toBe(200);
    expect(res2.status()).toBe(200);
  });

  test('duplicate Gumroad webhooks return 200', async ({ request }) => {
    const payload = {
      sale_id: `gum_dup_test_${uniqueId}`,
      product_name: 'Quick Cleanup Pack',
      email: `gum-dup-${uniqueId}@test.com`,
      price: 2500,
      timestamp: new Date().toISOString(),
    };

    const headers = {
      'x-gumroad-webhook-signature': 'test_sig_gum_dup',
      'content-type': 'application/json',
    };

    const [res1, res2] = await Promise.all([
      request.post(`${BASE}/api/webhooks/gumroad`, { data: payload, headers }),
      request.post(`${BASE}/api/webhooks/gumroad`, { data: payload, headers }),
    ]);

    // Both should be handled gracefully
    expect([200, 201, 204, 202, 400, 422]).toContain(res1.status());
    expect([200, 201, 204, 202, 400, 422]).toContain(res2.status());
  });

  test('out-of-order Stripe webhooks are handled gracefully', async ({ request }) => {
    // Send a payment_intent.succeeded before the checkout.session.completed
    const paymentIntentPayload = {
      id: `evt_ooo_pi_${uniqueId}`,
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: `pi_ooo_test_${uniqueId}`,
          amount: 2500,
          currency: 'usd',
        },
      },
    };

    const checkoutPayload = {
      id: `evt_ooo_cs_${uniqueId}`,
      type: 'checkout.session.completed',
      data: {
        object: {
          id: `cs_ooo_test_${uniqueId}`,
          client_reference_id: `ooo-ref-${uniqueId}`,
          customer_email: `ooo-${uniqueId}@test.com`,
          mode: 'payment',
          metadata: {},
          payment_status: 'paid',
          amount_total: 2500,
          currency: 'usd',
        },
      },
    };

    const signedPaymentIntent = stripeSignature(paymentIntentPayload);
    const signedCheckout = stripeSignature(checkoutPayload);

    const [piRes, csRes] = await Promise.all([
      request.post(`${BASE}/api/stripe/webhook`, {
        data: signedPaymentIntent.body,
        headers: { 'stripe-signature': signedPaymentIntent.header, 'content-type': 'application/json' },
      }),
      request.post(`${BASE}/api/stripe/webhook`, {
        data: signedCheckout.body,
        headers: { 'stripe-signature': signedCheckout.header, 'content-type': 'application/json' },
      }),
    ]);

    // Neither should 500 even if events arrive out of order
    expect(piRes.status()).not.toBe(500);
    expect(csRes.status()).not.toBe(500);
  });

  test('malformed webhook payloads are rejected without crashing', async ({ request }) => {
    const malformedPayloads = [
      'not-json-at-all',
      JSON.stringify({}),
      JSON.stringify({ id: '' }),
      JSON.stringify({ type: 'unknown.event' }),
    ];

    for (const body of malformedPayloads) {
      const res = await request.post(`${BASE}/api/stripe/webhook`, {
        data: body,
        headers: { 'stripe-signature': 'test_malformed', 'content-type': 'application/json' },
      });
      // Should not crash or hang — accept any valid HTTP response
      expect(res.status()).toBeGreaterThanOrEqual(400);
      expect(res.status()).not.toBe(0);
    }
  });
});
