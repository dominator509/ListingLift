import { z } from 'zod';
import type { PaymentAdapter } from './types';

const configSchema = z.object({ enabled: z.boolean().default(true) });

export const manualPaymentAdapter: PaymentAdapter<typeof configSchema> = {
  key: 'manual-payment',
  label: 'Manual Payment',
  featureFlag: 'MOCK_INTEGRATIONS_ENABLED',
  secretFields: [],
  configSchema,
  async healthCheck() {
    return { ok: true, provider: 'manual-payment', mode: 'manual', message: 'Manual payment fallback available.' };
  },
  async createCheckout() {
    return { ok: true, checkoutUrl: '/checkout/manual', externalId: `manual-${Date.now()}` };
  },
};
