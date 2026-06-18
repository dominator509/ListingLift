import { stripeCustomerPortalRequestSchema, type StripeCustomerPortalRequest } from '@/schemas/stripe-billing';

export function createStripeCustomerPortalDraft(input: StripeCustomerPortalRequest) {
  const data = stripeCustomerPortalRequestSchema.parse(input);
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  return {
    provider: 'stripe' as const,
    stripeCustomerId: data.stripeCustomerId,
    returnUrl: data.returnUrl ?? `${appUrl}/client/billing`,
    realCallRequired: true,
    note: 'Codex must replace this draft with stripe.billingPortal.sessions.create when Stripe is enabled.',
  };
}
