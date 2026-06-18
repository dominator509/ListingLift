import { describe, expect, it } from 'vitest';
import { agencyWhiteLabelCopyContainsUnsafeGuarantee, quoteAgencyVolumePricing, summarizeAgencyQueue, summarizeAgencyWorkspaces } from '@/domain/agency-white-label';

describe('agency white-label domain', () => {
  it('summarizes agency workspaces and queue volume', () => {
    const workspaceSummary = summarizeAgencyWorkspaces([
      { id: 'w1', clientName: 'A', workspaceName: 'A', status: 'ACTIVE', activeJobs: 2, completedJobs: 5, monthlyImageVolume: 125, whiteLabelEnabled: true, brandedReportsEnabled: true },
      { id: 'w2', clientName: 'B', workspaceName: 'B', status: 'PAUSED', activeJobs: 1, completedJobs: 1, monthlyImageVolume: 30, whiteLabelEnabled: false },
    ]);
    expect(workspaceSummary.activeWorkspaces).toBe(1);
    expect(workspaceSummary.monthlyImageVolume).toBe(155);

    const queueSummary = summarizeAgencyQueue([
      { id: 'q1', workspaceId: 'w1', clientName: 'A', jobTitle: 'Job', status: 'PROCESSING', imageCount: 25 },
      { id: 'q2', workspaceId: 'w1', clientName: 'A', jobTitle: 'Flagged', status: 'FLAGGED', imageCount: 5, requiresManualReview: true },
    ]);
    expect(queueSummary.totalImages).toBe(30);
    expect(queueSummary.blocked).toBe(1);
  });

  it('quotes volume tiers and detects unsafe promises', () => {
    const quote = quoteAgencyVolumePricing({ monthlyImageVolume: 900, workspaceCount: 8, rushQueueEnabled: true, brandedReportsEnabled: true });
    expect(quote.tierKey).toBe('growth');
    expect(quote.manualReviewRequired).toBe(true);
    expect(agencyWhiteLabelCopyContainsUnsafeGuarantee('Guaranteed marketplace approval for every listing.')).toBe(true);
    expect(agencyWhiteLabelCopyContainsUnsafeGuarantee('This does not guarantee marketplace approval or sales.')).toBe(false);
  });
});
