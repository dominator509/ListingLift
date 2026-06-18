import { getEnv } from '@/lib/env';
import { manualPaymentAdapter } from './manual-payment-adapter';
import { stripePaymentAdapter } from './stripe-adapter';

export const paymentAdapterRegistry = {
  [manualPaymentAdapter.key]: manualPaymentAdapter,
  [stripePaymentAdapter.key]: stripePaymentAdapter,
};

export function getDefaultPaymentAdapter() {
  const env = getEnv();
  if (env.REAL_INTEGRATIONS_ENABLED && env.STRIPE_ENABLED) return stripePaymentAdapter;
  return manualPaymentAdapter;
}
