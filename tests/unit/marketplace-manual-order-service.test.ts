import { describe, expect, it } from 'vitest';
import { createMarketplaceManualOrderPlan } from '@/server/services/marketplace-manual-order-service';

describe('marketplace manual order service', () => {
  it('normalizes eBay manual orders into a job draft and dedupe key', () => {
    const plan = createMarketplaceManualOrderPlan({ channelKey: 'ebay_manual', externalReference: 'EBAY-100', productNames: ['Lamp'], currency: 'USD', deliveryMode: 'SELLER_EXPORT_PACKAGE', revisionStatus: 'NONE', sellerReviewRequired: true, externalLinkAllowed: false, dryRun: true, imageRoles: ['WHITE_BACKGROUND_JPG'], presetKeys: ['EbayListing'] });
    expect(plan.dedupeKey).toContain('ebay-manual');
    expect(plan.jobDraft).toMatchObject({ status: 'WAITING_FOR_UPLOAD', sellerReviewRequired: true });
    expect(plan.auditEvents).toContain('job_creation_required');
  });
});
