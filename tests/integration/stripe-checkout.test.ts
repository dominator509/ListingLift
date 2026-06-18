/**
 * PHASE 3 — Stripe Checkout Integration
 *
 * Validates Stripe webhook signature verification and checkout session
 * integration. Uses real signature verification logic but the Stripe
 * webhook secret from environment.
 */

import { describe, expect, it, vi } from 'vitest';
import { createHmac } from 'node:crypto';
import {
  verifyStripeWebhookSignature,
  parseStripeSignatureHeader,
  computeStripeSignature,
} from '@/server/services/stripe-webhook-signature-service';

describe('Stripe checkout: signature verification and webhook handling', () => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret_for_integration_test';

  it('parses a Stripe signature header correctly', () => {
    const header = 't=1234567890,v1=abc123def456,v1=789012ghi345';
    const parsed = parseStripeSignatureHeader(header);
    expect(parsed.timestamp).toBe(1234567890);
    expect(parsed.signatures).toEqual(['abc123def456', '789012ghi345']);
  });

  it('computes a Stripe signature matching the expected format', () => {
    const payload = '{"id":"evt_test","type":"checkout.session.completed"}';
    const timestamp = 1700000000;
    const sig = computeStripeSignature(payload, timestamp, webhookSecret);
    const expected = createHmac('sha256', webhookSecret).update(`${timestamp}.${payload}`).digest('hex');
    expect(sig).toBe(expected);
  });

  it('verifies a valid Stripe webhook signature', () => {
    const payload = JSON.stringify({
      id: 'evt_test_123',
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_test_456' } },
    });
    const timestamp = Math.floor(Date.now() / 1000) - 30; // 30 seconds ago
    const signature = computeStripeSignature(payload, timestamp, webhookSecret);
    const header = `t=${timestamp},v1=${signature}`;

    const result = verifyStripeWebhookSignature({
      payload,
      signatureHeader: header,
      webhookSecret,
      toleranceSeconds: 300,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.eventId).toBe('evt_test_123');
      expect(result.eventType).toBe('checkout.session.completed');
    }
  });

  it('rejects a webhook signature outside the tolerance window', () => {
    const payload = '{"id":"evt_old","type":"checkout.session.expired"}';
    const timestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago (outside 5min tolerance)
    const signature = computeStripeSignature(payload, timestamp, webhookSecret);
    const header = `t=${timestamp},v1=${signature}`;

    const result = verifyStripeWebhookSignature({
      payload,
      signatureHeader: header,
      webhookSecret,
      toleranceSeconds: 300,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('tolerance');
  });

  it('rejects a webhook with a bad signature', () => {
    const payload = '{"id":"evt_bad","type":"payment_intent.succeeded"}';
    const timestamp = Math.floor(Date.now() / 1000);
    const header = `t=${timestamp},v1=badbadbadbadbadbadbadbadbadbadbadbadbadb`;

    const result = verifyStripeWebhookSignature({
      payload,
      signatureHeader: header,
      webhookSecret,
      toleranceSeconds: 300,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('mismatch');
  });

  it('rejects a malformed signature header', () => {
    const result = verifyStripeWebhookSignature({
      payload: '{}',
      signatureHeader: 'invalid-header-without-pipe',
      webhookSecret,
    });

    expect(result.ok).toBe(false);
  });

  it('verifies a signature with the default tolerance', () => {
    const payload = '{"id":"evt_default","type":"checkout.session.completed"}';
    const timestamp = Math.floor(Date.now() / 1000) - 60; // 1 minute ago
    const signature = computeStripeSignature(payload, timestamp, webhookSecret);
    const header = `t=${timestamp},v1=${signature}`;

    const result = verifyStripeWebhookSignature({
      payload,
      signatureHeader: header,
      webhookSecret,
    });

    expect(result.ok).toBe(true);
  });
});
