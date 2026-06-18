import { resolveStripePackagePrice } from './stripe-checkout-service';
import { getEnv } from '@/lib/env';

const MIN_PRICE_CENTS = 1;   // $0.01
const MAX_PRICE_CENTS = 10_000_000; // $100,000

/**
 * Known Stripe Price IDs mapped by package key.
 * Resolved from environment variables at runtime.
 */
function getKnownPriceIds(): Map<string, string> {
  const env = getEnv();
  const map = new Map<string, string>();
  if (env.STRIPE_PRICE_QUICK_CLEANUP) map.set('QuickCleanup10', env.STRIPE_PRICE_QUICK_CLEANUP);
  if (env.STRIPE_PRICE_MARKETPLACE_LISTING) map.set('MarketplaceListing25', env.STRIPE_PRICE_MARKETPLACE_LISTING);
  if (env.STRIPE_PRICE_PRODUCT_LAUNCH) map.set('ProductLaunch50', env.STRIPE_PRICE_PRODUCT_LAUNCH);
  if (env.STRIPE_PRICE_MONTHLY_RETAINER) map.set('MonthlySellerRetainer', env.STRIPE_PRICE_MONTHLY_RETAINER);
  if (env.STRIPE_PRICE_AGENCY_WHITE_LABEL) map.set('AgencyWhiteLabel', env.STRIPE_PRICE_AGENCY_WHITE_LABEL);
  return map;
}

export type PriceValidationResult =
  | { ok: true; amountCents: number }
  | { ok: false; error: string; status: number };

/**
 * Validate a Stripe checkout request against server-side price config.
 *
 * - Resolves price from server-side package config (never from client payload)
 * - Rejects if resolved amount exceeds min/max bounds
 * - Rejects if a client-submitted amountCents doesn't match server price
 * - Optionally validates a STRIPE_PRICE_ID against known IDs
 */
export function validateStripeCheckoutPrice(input: {
  packageKey: string;
  purpose: string;
  imageQuantity?: number;
  clientAmountCents?: number;
  stripePriceId?: string;
}): PriceValidationResult {
  // P11: Fetch price from server config, not from client payload
  let serverPrice: ReturnType<typeof resolveStripePackagePrice>;
  try {
    serverPrice = resolveStripePackagePrice(input.packageKey, input.purpose, input.imageQuantity);
  } catch (err) {
    return { ok: false, error: `Unknown package: ${input.packageKey}`, status: 400 };
  }

  const amountCents = serverPrice.amountCents;

  // P11: Min/max price bounds
  if (amountCents < MIN_PRICE_CENTS) {
    return { ok: false, error: 'Price is below minimum allowed ($0.01).', status: 400 };
  }
  if (amountCents > MAX_PRICE_CENTS) {
    return { ok: false, error: 'Price exceeds maximum allowed ($100,000).', status: 400 };
  }

  // P11: Compare client-submitted amount against server-side price
  if (input.clientAmountCents !== undefined && input.clientAmountCents !== null) {
    if (input.clientAmountCents !== amountCents) {
      return {
        ok: false,
        error: `Price tampering detected: client submitted $${(input.clientAmountCents / 100).toFixed(2)} but server price is $${(amountCents / 100).toFixed(2)}.`,
        status: 400,
      };
    }
  }

  // P11: Validate STRIPE_PRICE_ID against known IDs
  if (input.stripePriceId) {
    const knownPriceIds = getKnownPriceIds();
    const expectedId = knownPriceIds.get(input.packageKey);
    if (expectedId && input.stripePriceId !== expectedId) {
      return {
        ok: false,
        error: `STRIPE_PRICE_ID mismatch for package ${input.packageKey}: client submitted "${input.stripePriceId}" but expected "${expectedId}".`,
        status: 400,
      };
    }
    // If no known price ID for this package, accept the submitted ID
  }

  return { ok: true, amountCents };
}
