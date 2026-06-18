import { describe, expect, it } from 'vitest';
import { createShopifyManualOrderPlan } from '@/server/services/shopify-order-intake-service';

describe('createShopifyManualOrderPlan', () => {
  it('normalizes a manual Shopify job into ListingLift drafts', () => {
    const plan = createShopifyManualOrderPlan({
      orderAmount: 129,
      currency: 'USD',
      deliveryMode: 'EMAIL_WITH_ALLOWED_LINK',
      replacementApprovalStatus: 'NOT_REQUESTED',
      externalLinkAllowed: false,
      uploadStatus: 'WAITING_FOR_UPLOAD',
      sourceMode: 'MANUAL',
      dryRun: true,
      storeDomain: 'Demo-Store.myshopify.com',
      productIds: ['gid://shopify/Product/123'],
      skus: ['sku 1'],
      productTitles: ['Demo Product'],
      orderAmountCents: 12900,
    });
    expect(plan.channelKey).toBe('Shopify');
    expect(plan.jobDraft.targetPlatform).toBe('Shopify');
    expect(plan.jobDraft.selectedPresetKeys).toContain('ShopifyProductImage');
    expect(plan.externalOrderDraft.dedupeKey).toContain('shopify:demo-store.myshopify.com');
  });
});
