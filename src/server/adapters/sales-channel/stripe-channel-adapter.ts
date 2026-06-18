import { z } from 'zod';
import { normalizeStripeCheckoutOrder } from '@/server/services/sales-channel-normalizer';
import type { SalesChannelAdapter } from './types';

const configSchema = z.object({ enabled: z.boolean().default(false) });

export const stripeSalesChannelAdapter: SalesChannelAdapter<typeof configSchema> = {
  key: 'stripe',
  canonicalChannelKey: 'Stripe',
  label: 'Stripe Checkout Webhook',
  featureFlag: 'STRIPE_ENABLED',
  secretFields: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
  supportedModes: ['WEBHOOK', 'API', 'MANUAL'],
  marketplaceSafetyRules: ['Verify Stripe webhook signatures.', 'Never expose Stripe secrets to the frontend.', 'Use server-side checkout and package pricing only.'],
  configSchema,
  async healthCheck() {
    return { ok: true, provider: 'stripe', mode: 'mock', message: 'Stripe normalization scaffold available. Real calls disabled by default.' };
  },
  async normalize(input) {
    return normalizeStripeCheckoutOrder((input ?? {}) as Record<string, unknown>);
  },
};
