import { describe, expect, it } from 'vitest';
import { createUpworkManualContractPlan } from '@/server/services/upwork-contract-intake-service';

describe('upwork contract intake service', () => {
  it('builds a normalized external order and job draft', () => {
    const plan = createUpworkManualContractPlan({
      milestoneStatus: 'ACTIVE',
      hourlyRate: undefined,
      uploadStatus: 'WAITING_FOR_UPLOAD',
      dryRun: true,
      contractId: 'UP-123 456',
      clientName: 'Acme Seller',
      contractTitle: 'Bulk product photo cleanup for Shopify catalog',
      contractType: 'FIXED_PRICE',
      billedAmount: 450,
      currency: 'USD',
    });
    expect(plan.externalOrderDraft.provider).toBe('upwork');
    expect(plan.externalOrderDraft.dedupeKey).toBe('upwork:UP-123-456');
    expect(plan.jobDraft.sourceChannel).toBe('Upwork');
    expect(plan.uploadLinkPlan.shouldCreateUploadToken).toBe(true);
  });
});
