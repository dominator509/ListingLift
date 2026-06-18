import { DEFAULT_PACKAGES } from '@/domain/packages';
import { buildStripeCheckoutReference, getStripeCheckoutMode, sanitizeStripeMetadata } from '@/domain/stripe-billing';
import { stripeCheckoutRequestSchema, stripeCreditPurchaseSchema, type StripeCheckoutRequestInput, type StripeCreditPurchaseInput } from '@/schemas/stripe-billing';
import { stripePaymentAdapter } from '@/server/adapters/payments/stripe-adapter';
import { trackCheckoutSession } from '@/server/services/stripe-session-reconciliation-service';

export function resolveStripePackagePrice(packageKey: string, purpose: string, imageQuantity?: number) {
  const pkg = DEFAULT_PACKAGES.find((candidate) => candidate.key === packageKey || candidate.publicSlug === packageKey);
  if (!pkg) throw new Error(`Unknown package for Stripe checkout: ${packageKey}`);
  const base = pkg.priceMinCents ?? 0;
  const max = pkg.priceMaxCents ?? base;
  const imageAllowance = pkg.imageAllowance ?? pkg.imageMax ?? imageQuantity ?? 1;
  const overage = imageQuantity && imageAllowance && imageQuantity > imageAllowance && pkg.pricePolicy.overagePriceCents
    ? (imageQuantity - imageAllowance) * pkg.pricePolicy.overagePriceCents
    : 0;
  const amountCents = purpose === 'AGENCY' || purpose === 'RETAINER' || purpose === 'SUBSCRIPTION' ? max : base + overage;
  return { package: pkg, amountCents, currency: pkg.currency, imageAllowance, overageCents: overage };
}

export function createStripeCheckoutSessionDraft(input: StripeCheckoutRequestInput) {
  const data = stripeCheckoutRequestSchema.parse(input);
  const price = resolveStripePackagePrice(data.packageKey, data.purpose, data.imageQuantity);
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const successUrl = data.successUrl ?? `${appUrl}/upload/stripe-success-placeholder`;
  const cancelUrl = data.cancelUrl ?? `${appUrl}/pricing?checkout=cancelled`; 
  const metadata = sanitizeStripeMetadata({ ...data.metadata, packageKey: price.package.key, purpose: data.purpose, source: 'stripe' });
  const clientReferenceId = buildStripeCheckoutReference('ll', `${price.package.key}_${Date.now()}`);

  // P26: Track session for reconciliation
  trackCheckoutSession({
    clientReferenceId,
    packageKey: price.package.key,
    purpose: data.purpose,
    amountCents: price.amountCents,
  });

  return {
    provider: 'stripe' as const,
    checkoutMode: getStripeCheckoutMode(data.purpose),
    purpose: data.purpose,
    packageKey: price.package.key,
    amountCents: price.amountCents,
    currency: price.currency,
    quantity: data.quantity,
    successUrl,
    cancelUrl,
    buyerEmail: data.buyerEmail,
    metadata,
    clientReferenceId,
    manualFallbackAvailable: true,
  };
}

export async function createStripeCheckoutSession(input: StripeCheckoutRequestInput) {
  const draft = createStripeCheckoutSessionDraft(input);
  const adapterResult = await stripePaymentAdapter.createCheckout({
    packageKey: draft.packageKey,
    clientEmail: draft.buyerEmail,
    successUrl: draft.successUrl,
    cancelUrl: draft.cancelUrl,
    purpose: draft.purpose,
    amountCents: draft.amountCents,
    currency: draft.currency,
    metadata: draft.metadata,
  });
  return { draft, adapterResult };
}

export function createStripeCreditCheckoutDraft(input: StripeCreditPurchaseInput) {
  const data = stripeCreditPurchaseSchema.parse(input);
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const amountCents = data.creditAmount * 100;
  const clientReferenceId = buildStripeCheckoutReference('ll_credits', data.creditAmount);

  // P26: Track session for reconciliation
  trackCheckoutSession({
    clientReferenceId,
    packageKey: 'credit-purchase',
    purpose: 'CREDITS',
    amountCents,
  });

  return {
    provider: 'stripe' as const,
    checkoutMode: 'payment' as const,
    purpose: 'CREDITS' as const,
    packageKey: 'credit-purchase',
    amountCents,
    currency: 'USD',
    quantity: 1,
    successUrl: data.successUrl ?? `${appUrl}/client/billing?credits=success`,
    cancelUrl: data.cancelUrl ?? `${appUrl}/client/billing?credits=cancelled`,
    buyerEmail: data.buyerEmail,
    metadata: sanitizeStripeMetadata({ organizationId: data.organizationId ?? '', clientId: data.clientId ?? '', purpose: 'CREDITS', source: 'stripe' }),
    clientReferenceId,
    manualFallbackAvailable: true,
  };
}
