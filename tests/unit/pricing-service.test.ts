import { describe, expect, it } from 'vitest';
import { buildPackageQuote, formatCents } from '@/server/services/pricing-service';

describe('pricing service contract', () => {
  it('builds server-side checkout-ready quotes for direct checkout packages', () => {
    const quote = buildPackageQuote({ packageKey: 'MarketplaceListing25', imageQuantity: 25, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    expect(quote.manualQuoteRequired).toBe(false);
    expect(quote.estimatedCents).toBeGreaterThan(0);
    expect(quote.imageAllowance).toBe(25);
    expect(quote.revisionAllowance).toBe(2);
  });

  it('requires manual quote when image quantity exceeds package threshold', () => {
    const quote = buildPackageQuote({ packageKey: 'QuickCleanup10', imageQuantity: 20, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    expect(quote.manualQuoteRequired).toBe(true);
    expect(quote.checkoutMode).toBe('manual_quote');
    expect(quote.quoteReasons.join(' ')).toMatch(/manual quote/i);
  });

  it('keeps launch and agency packages operator-reviewed by default', () => {
    expect(buildPackageQuote({ packageKey: 'ProductLaunch50', imageQuantity: 50, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false }).manualQuoteRequired).toBe(true);
    expect(buildPackageQuote({ packageKey: 'AgencyWhiteLabel', imageQuantity: 250, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false }).manualQuoteRequired).toBe(true);
  });

  it('formats cents as display-only text without driving checkout logic', () => {
    expect(formatCents(14900)).toBe('$149');
    expect(formatCents(null)).toBe('Custom quote');
  });
});
