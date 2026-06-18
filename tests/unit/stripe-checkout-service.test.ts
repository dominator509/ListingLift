import { describe, expect, it } from 'vitest';
import { createStripeCheckoutSessionDraft, resolveStripePackagePrice } from '@/server/services/stripe-checkout-service';

describe('stripe checkout service seed contract', () => {
  it('resolves package prices server-side', () => {
    const price = resolveStripePackagePrice('QuickCleanup10', 'PACKAGE', 10);
    expect(price.amountCents).toBeGreaterThan(0);
    expect(price.package.key).toBe('QuickCleanup10');
  });

  it('builds checkout metadata without trusting client-submitted prices', () => {
    const draft = createStripeCheckoutSessionDraft({ packageKey: 'QuickCleanup10', purpose: 'PACKAGE', quantity: 1, metadata: { amountCents: 1, unsafe: 'ignored' } });
    expect(draft.provider).toBe('stripe');
    expect(draft.amountCents).toBeGreaterThan(1);
    expect((draft.metadata as Record<string, unknown>).unsafe).toBeUndefined();
  });
});
