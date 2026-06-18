import { describe, expect, it } from 'vitest';
import { createEtsyManualOrderPlan } from '@/server/services/etsy-order-intake-service';
import { createEtsyListingImportPlan } from '@/server/services/etsy-listing-import-service';

describe('Phase 24 Etsy route contracts', () => {
  it('supports manual order and listing import planning without persistence', () => {
    const order = createEtsyManualOrderPlan({ orderId: 'etsy-100', shopName: 'Seed Shop', listingIds: ['1'], orderAmountCents: 9900, listingTitles: ['Seed item'], orderAmount: 99, currency: 'USD', useCases: ['SQUARE_LISTING_IMAGE'], deliveryMode: 'ETSY_MESSAGE_WITH_ALLOWED_LINK', externalLinkAllowed: false, uploadStatus: 'WAITING_FOR_UPLOAD', sourceMode: 'MANUAL', dryRun: true });
    const importPlan = createEtsyListingImportPlan({ listingRows: [{ listingId: '1', title: 'Seed item', imageCount: 5 }], importMode: 'MANUAL', dryRun: true });
    expect(order.mode).toBe('DRY_RUN');
    expect(importPlan.listingCount).toBe(1);
  });
});
