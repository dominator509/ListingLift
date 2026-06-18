export type StripeCheckoutPurpose = 'PACKAGE' | 'SUBSCRIPTION' | 'CREDITS' | 'RETAINER' | 'AGENCY';
export type StripeCheckoutMode = 'payment' | 'subscription';
export type StripeBillingAccessDecision = 'ALLOW' | 'DENY_NEEDS_APPROVAL' | 'DENY_PAYMENT_FAILED' | 'DENY_NOT_PAID' | 'DENY_DUPLICATE' | 'DENY_UNSUPPORTED';

export const STRIPE_PROVIDER_KEY = 'stripe' as const;

export const STRIPE_CHECKOUT_PURPOSES: StripeCheckoutPurpose[] = ['PACKAGE', 'SUBSCRIPTION', 'CREDITS', 'RETAINER', 'AGENCY'];

export const STRIPE_SUPPORTED_EVENT_TYPES = [
  'checkout.session.completed',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
] as const;

export type StripeSupportedEventType = (typeof STRIPE_SUPPORTED_EVENT_TYPES)[number];

export const STRIPE_CHECKOUT_MODE_BY_PURPOSE: Record<StripeCheckoutPurpose, StripeCheckoutMode> = {
  PACKAGE: 'payment',
  CREDITS: 'payment',
  SUBSCRIPTION: 'subscription',
  RETAINER: 'subscription',
  AGENCY: 'subscription',
};

export const STRIPE_SAFE_METADATA_KEYS = [
  'organizationId',
  'clientId',
  'jobId',
  'packageKey',
  'purpose',
  'salesChannelKey',
  'source',
] as const;

export type StripeSafeMetadataKey = (typeof STRIPE_SAFE_METADATA_KEYS)[number];

export function isStripeSupportedEvent(eventType: string): eventType is StripeSupportedEventType {
  return STRIPE_SUPPORTED_EVENT_TYPES.includes(eventType as StripeSupportedEventType);
}

export function getStripeCheckoutMode(purpose: StripeCheckoutPurpose): StripeCheckoutMode {
  return STRIPE_CHECKOUT_MODE_BY_PURPOSE[purpose];
}

export function sanitizeStripeMetadata(input: Record<string, unknown>) {
  const output: Partial<Record<StripeSafeMetadataKey, string>> = {};
  for (const key of STRIPE_SAFE_METADATA_KEYS) {
    const value = input[key];
    if (typeof value === 'string' && value.trim()) output[key] = value.trim().slice(0, 500);
  }
  return output;
}

export function redactStripeSecret(value: string | null | undefined) {
  if (!value) return '';
  if (value.length <= 8) return '********';
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

export function evaluatePaidFulfillmentAccess(input: {
  paymentStatus: 'UNPAID' | 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED' | 'MANUAL_CONFIRMED';
  approvalReady: boolean;
  duplicate: boolean;
}) {
  if (input.duplicate) return 'DENY_DUPLICATE' satisfies StripeBillingAccessDecision;
  if (input.paymentStatus === 'FAILED' || input.paymentStatus === 'REFUNDED') return 'DENY_PAYMENT_FAILED' satisfies StripeBillingAccessDecision;
  if (input.paymentStatus !== 'PAID' && input.paymentStatus !== 'MANUAL_CONFIRMED') return 'DENY_NOT_PAID' satisfies StripeBillingAccessDecision;
  if (!input.approvalReady) return 'DENY_NEEDS_APPROVAL' satisfies StripeBillingAccessDecision;
  return 'ALLOW' satisfies StripeBillingAccessDecision;
}

export function buildStripeCheckoutReference(prefix: string, entropy: string | number = Date.now()) {
  return `${prefix}_${String(entropy).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40)}`;
}
