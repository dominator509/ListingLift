import { describe, expect, it } from 'vitest';
import { buildAgencyVolumePricingQuote } from '@/server/services/agency-billing-service';

describe('agency billing service', () => {
  it('returns a manual-review dry-run volume quote', () => {
    const quote = buildAgencyVolumePricingQuote({ monthlyImageVolume: 1800, workspaceCount: 10, rushQueueEnabled: true, brandedReportsEnabled: true, apiAccessRequested: true, currency: 'USD' });
    expect(quote.tierKey).toBe('scale');
    expect(quote.manualReviewRequired).toBe(true);
    expect(quote.dryRun).toBe(true);
    expect(quote.formattedEstimatedMonthly).toContain('$');
  });
});
