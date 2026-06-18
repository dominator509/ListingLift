import { describe, expect, it } from 'vitest';
import { createFiverrManualOrderPlan } from '@/server/services/fiverr-order-intake-service';

describe('Fiverr manual order intake', () => {
  it('creates a normalized job and upload-link plan', () => {
    const plan = createFiverrManualOrderPlan({
      orderId: 'FO 123',
      buyerUsername: 'buyer123',
      gigTitle: 'Standard marketplace product image pack — 25 images',
      orderAmountCents: 9900,
      orderAmount: 99,
      currency: 'USD',
      dryRun: true,
      uploadStatus: 'WAITING_FOR_UPLOAD',
    });
    expect(plan.externalOrderDraft.dedupeKey).toBe('fiverr:FO-123');
    expect(plan.jobDraft.packageKey).toBe('MarketplaceListing25');
    expect(plan.uploadLinkPlan.shouldCreateUploadToken).toBe(true);
    expect(plan.safety.noScraping).toBe(true);
  });
});
