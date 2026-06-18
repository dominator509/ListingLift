import { describe, expect, it } from 'vitest';
import { createGumroadPurchaseIntakePlan } from '@/server/services/gumroad-purchase-intake-service';

describe('Gumroad purchase intake service', () => {
  it('creates a job and upload-link plan for image-pack purchases', () => {
    const plan = createGumroadPurchaseIntakePlan({
      organizationId: 'org_1',
      dryRun: true,
      payload: { sale_id: 'gum_sale_1', product_name: '10-image cleanup pack', email: 'seller@example.com', price_cents: 2500, currency: 'USD', price: 2500, refunded: false, chargebacked: false, disputed: false, dispute_won: false, test: false },
    });
    expect(plan.externalOrderDraft.salesChannelKey).toBe('Gumroad');
    expect(plan.jobDraft?.status).toBe('WAITING_FOR_UPLOAD');
    expect(plan.uploadLinkPlan.createUploadToken).toBe(true);
  });

  it('applies credits without creating an immediate job for credit packs', () => {
    const plan = createGumroadPurchaseIntakePlan({
      dryRun: true,
      payload: { sale_id: 'gum_sale_2', product_name: 'Monthly image cleanup credit pack', email: 'seller@example.com', price_cents: 19900, currency: 'USD', price: 19900, refunded: false, chargebacked: false, disputed: false, dispute_won: false, test: false },
    });
    expect(plan.jobDraft).toBeNull();
    expect(plan.creditLedgerDraft?.amount).toBeGreaterThan(0);
    expect(plan.uploadLinkPlan.createUploadToken).toBe(false);
  });

  it('keeps refunded sales from automatic fulfillment', () => {
    const plan = createGumroadPurchaseIntakePlan({
      dryRun: true,
      payload: { sale_id: 'gum_sale_3', product_name: '10-image cleanup pack', email: 'seller@example.com', refunded: true, price_cents: 2500, currency: 'USD', price: 2500, chargebacked: false, disputed: false, dispute_won: false, test: false },
    });
    expect(plan.ignore.ignore).toBe(true);
    expect(plan.purchase.paymentStatus).toBe('REFUNDED');
  });
});
