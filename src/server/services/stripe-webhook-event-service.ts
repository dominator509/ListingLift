import { isStripeSupportedEvent } from '@/domain/stripe-billing';
import { stripeWebhookEventSchema, type StripeWebhookEventInput } from '@/schemas/stripe-billing';

export type StripeWebhookProcessingDraft = {
  provider: 'stripe';
  externalId: string;
  eventType: string;
  supported: boolean;
  signatureVerified: boolean;
  shouldGrantAccess: boolean;
  shouldCreateJob: boolean;
  shouldApplyCredits: boolean;
  shouldUpdateSubscription: boolean;
  shouldDenyAccess: boolean;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  auditAction: string;
  safeMessage: string;
};

export function createStripeWebhookProcessingDraft(input: StripeWebhookEventInput, signatureVerified = false): StripeWebhookProcessingDraft {
  const event = stripeWebhookEventSchema.parse(input);
  const supported = isStripeSupportedEvent(event.type);
  const paid = event.type === 'checkout.session.completed' || event.type === 'invoice.paid';
  const failed = event.type === 'checkout.session.async_payment_failed' || event.type === 'invoice.payment_failed' || event.type === 'checkout.session.expired';
  const subscription = event.type.startsWith('customer.subscription.');
  return {
    provider: 'stripe',
    externalId: event.id,
    eventType: event.type,
    supported,
    signatureVerified,
    shouldGrantAccess: signatureVerified && paid,
    shouldCreateJob: signatureVerified && event.type === 'checkout.session.completed',
    shouldApplyCredits: signatureVerified && paid,
    shouldUpdateSubscription: signatureVerified && subscription,
    shouldDenyAccess: failed || !signatureVerified || !supported,
    paymentStatus: paid ? 'PAID' : failed ? 'FAILED' : 'PENDING',
    auditAction: `stripe.${event.type}`,
    safeMessage: supported ? 'Stripe event accepted for idempotent processing.' : 'Unsupported Stripe event ignored safely.',
  };
}

export function assertStripeWebhookCanGrantAccess(draft: StripeWebhookProcessingDraft) {
  if (!draft.signatureVerified) return { ok: false, reason: 'signature_not_verified' };
  if (!draft.supported) return { ok: false, reason: 'unsupported_event' };
  if (draft.paymentStatus !== 'PAID') return { ok: false, reason: 'not_paid' };
  return { ok: true, reason: 'paid_and_verified' };
}
