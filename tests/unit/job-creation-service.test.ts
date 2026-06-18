import { describe, expect, it } from 'vitest';
import { manualJobCreateSchema } from '@/schemas/job';
import { assertManualJobCreationSafe, buildManualJobDraft } from '@/server/services/job-creation-service';

describe('manual job creation service', () => {
  const input = manualJobCreateSchema.parse({
    clientName: 'Demo Client',
    title: 'Marketplace Listing Pack — Demo Products',
    packageKey: 'marketplace-listing-pack',
    targetPlatform: 'Etsy',
    imageQuantity: 25,
    priority: 'HIGH',
    sourceChannelName: 'manual',
    orderAmount: 149,
    currency: 'USD',
  });

  it('builds a waiting-for-upload manual job draft', () => {
    const draft = buildManualJobDraft(input, { organizationSlug: 'demo-org', existingJobCount: 7, now: '2026-06-03T12:00:00.000Z' });
    expect(draft.status).toBe('WAITING_FOR_UPLOAD');
    expect(draft.jobNumber).toMatch(/^DEMO-202606-00008$/);
    expect(draft.revenueAttribution.attributionMode).toBe('MANUAL_ADMIN_ENTRY');
  });

  it('rejects source URLs that look like tokens', () => {
    const unsafe = { ...input, sourceUrl: 'https://example.com/order?token=secret' };
    expect(() => assertManualJobCreationSafe(unsafe)).toThrow(/must not contain/);
  });
});
