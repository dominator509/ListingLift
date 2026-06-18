import { describe, expect, it } from 'vitest';
import { createGenericSalesChannelManualOrderPlan } from '@/server/services/generic-channel-manual-order-service';

describe('generic sales channel manual order service', () => {
  it('builds a normalized manual order plan with dedupe and job drafts', () => {
    const plan = createGenericSalesChannelManualOrderPlan({
      leadIntent: 'IMAGE_CLEANUP',
      orderAmount: 199,
      externalLinkAllowed: false,
      uploadStatus: 'WAITING_FOR_UPLOAD',
      workflowStatus: 'LEAD_CAPTURED',
      dryRun: true,
      channelKey: 'Freelancer',
      externalReference: 'FL-100',
      leadTitle: 'Bulk product cleanup',
      buyerName: 'Buyer Name',
      orderAmountCents: 19900,
      currency: 'USD',
    });
    expect(plan.externalOrderDraft.dedupeKey).toContain('freelancer');
    expect(plan.jobDraft.sourceChannel).toBe('Freelancer');
    expect(plan.uploadLinkPlan.shouldCreateUploadToken).toBe(true);
  });
});
