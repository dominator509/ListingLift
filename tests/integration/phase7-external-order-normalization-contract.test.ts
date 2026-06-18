import { describe, expect, it } from 'vitest';
import { buildSalesChannelNormalizationPlan } from '@/server/services/sales-channel-normalization-service';


describe('phase 7 external order normalization contract', () => {
  it('creates a dry-run plan containing external order, client, job, upload trigger, and revenue attribution drafts', async () => {
    const plan = await buildSalesChannelNormalizationPlan({
      organizationId: 'org_1',
      request: {
        channelKey: 'fiverr',
        mode: 'MANUAL',
        dryRun: true,
        payload: {
          order_id: 'FIV-42',
          buyer_username: 'seller_user',
          gig_title: 'Marketplace Listing',
          price: 149,
          currency: 'USD',
          paymentStatus: 'paid',
        },
      },
    });
    expect(plan.normalizedOrder.channelName).toBe('Fiverr');
    expect(plan.externalOrderDraft.dedupeKey).toBe('org_1:fiverr:fiv-42');
    expect(plan.clientMatch.matchStrategy).toBe('new_client');
    expect(plan.jobDraft.status).toBe('WAITING_FOR_UPLOAD');
    expect(plan.revenueAttribution.grossAmountCents).toBe(14900);
    expect(plan.uploadTriggerPlan.shouldTriggerUploadLink).toBe(true);
  });

  it('blocks duplicate external orders before job creation', async () => {
    await expect(buildSalesChannelNormalizationPlan({
      organizationId: 'org_1',
      existingExternalOrderDedupeKeys: ['org_1:fiverr:fiv-42'],
      request: { channelKey: 'fiverr', mode: 'MANUAL', dryRun: true, payload: { order_id: 'FIV-42', buyer_username: 'seller_user' } },
    })).rejects.toThrow(/Duplicate external order prevented/);
  });
});
