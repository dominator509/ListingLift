import { z } from 'zod';
import { getEnv } from '@/lib/env';
import { buildStripeCheckoutReference } from '@/domain/stripe-billing';
import { verifyStripeWebhookSignature } from '@/server/services/stripe-webhook-signature-service';
import type { PaymentAdapter } from './types';

const configSchema = z.object({ secretKeyRef: z.string().min(1), webhookSecretRef: z.string().min(1), testMode: z.boolean().default(true) });

export const stripePaymentAdapter: PaymentAdapter<typeof configSchema> = {
  key: 'stripe',
  label: 'Stripe Checkout',
  featureFlag: 'STRIPE_ENABLED',
  secretFields: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
  configSchema,
  async healthCheck() {
    const env = getEnv();
    const enabled = env.STRIPE_ENABLED && env.REAL_INTEGRATIONS_ENABLED;
    return {
      ok: Boolean(enabled && env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET),
      provider: 'stripe',
      mode: enabled ? 'test' : 'disabled',
      message: enabled
        ? 'Stripe feature flags are enabled. Codex must verify SDK calls in test mode before production.'
        : 'Stripe is disabled by default. Manual payment fallback remains available.',
    };
  },
  async createCheckout(request) {
    const env = getEnv();
    if (!env.STRIPE_ENABLED || !env.REAL_INTEGRATIONS_ENABLED) {
      return {
        ok: false,
        provider: 'stripe',
        mode: 'disabled',
        error: 'Stripe checkout is disabled by feature flags. Use manual payment fallback.',
        manualFallbackRequired: true,
      };
    }

    // Seed contract only. Codex must replace this with the official Stripe SDK call in the implementation repo.
    return {
      ok: true,
      provider: 'stripe',
      mode: 'test',
      externalId: buildStripeCheckoutReference('cs_seed'),
      checkoutUrl: `${request.successUrl}?stripe_seed_checkout=1`,
      raw: { request, note: 'Replace with stripe.checkout.sessions.create in Codex.' },
    };
  },
  async verifyWebhook(payload, signature) {
    const env = getEnv();
    if (!signature || !env.STRIPE_WEBHOOK_SECRET) return { ok: false, provider: 'stripe', error: 'Missing Stripe signature or webhook secret.' };
    const result = verifyStripeWebhookSignature({ payload, signatureHeader: signature, webhookSecret: env.STRIPE_WEBHOOK_SECRET, toleranceSeconds: 300 });
    return { ok: result.ok, provider: 'stripe', eventId: result.eventId, eventType: result.eventType, error: result.error };
  },
};
