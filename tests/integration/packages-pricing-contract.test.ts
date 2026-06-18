import { describe, expect, it } from 'vitest';
import { buildCheckoutEntryDraft } from '@/server/services/checkout-entry-service';
import { buildPackageAdminDraft } from '@/server/services/package-service';

describe('Phase 5 packages and pricing integration contract', () => {
  it('creates a normalized checkout entry draft from selected package data', () => {
    const draft = buildCheckoutEntryDraft({
      packageKey: 'MarketplaceListing25',
      buyerName: 'Test Buyer',
      buyerEmail: 'buyer@example.com',
      businessName: 'Test Store',
      targetPlatform: 'Etsy',
      imageQuantity: 25,
      salesChannelKey: 'Direct',
    });

    expect(draft.package.key).toBe('MarketplaceListing25');
    expect(draft.normalizedJobDefaults.status).toBe('DRAFT');
    expect(draft.nextAction).toBe('checkout_provider_selection');
  });

  it('keeps manual quote package entries in pending/manual state', () => {
    const draft = buildCheckoutEntryDraft({
      packageKey: 'ProductLaunch100',
      buyerName: 'Launch Founder',
      buyerEmail: 'founder@example.com',
      imageQuantity: 100,
      salesChannelKey: 'Direct',
    });

    expect(draft.nextAction).toBe('operator_manual_quote');
    expect(draft.normalizedJobDefaults.paymentStatus).toBe('PENDING');
  });

  it('requires manage:packages and audit reason for admin package changes', () => {
    const update = buildPackageAdminDraft({ key: 'QuickCleanup10', priceMinCents: 2900, changeReason: 'Adjust entry offer after launch review.' });
    expect(update.requiresPermission).toBe('manage:packages');
    expect(update.auditAction).toBe('package.update.requested');
    expect(update.auditReason).toMatch(/launch review/i);
  });
});
