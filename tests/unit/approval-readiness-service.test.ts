import { describe, expect, it } from 'vitest';
import { evaluateApprovalReadiness } from '@/domain/manual-approval';

describe('approval readiness', () => {
  it('blocks approval when QC flags remain unresolved', () => {
    const readiness = evaluateApprovalReadiness({ jobId: 'job-1', outputCount: 2, approvedOutputCount: 2, rejectedOutputCount: 0, unresolvedBlockingFlags: 1, openRevisionCount: 0, manualReplacementRequiredCount: 0 });
    expect(readiness.canApproveJob).toBe(false);
    expect(readiness.status).toBe('BLOCKED_BY_FLAGS');
    expect(readiness.canExposeDelivery).toBe(false);
  });

  it('allows manual approval readiness but not delivery exposure', () => {
    const readiness = evaluateApprovalReadiness({ jobId: 'job-1', outputCount: 2, approvedOutputCount: 2, rejectedOutputCount: 0, unresolvedBlockingFlags: 0, openRevisionCount: 0, manualReplacementRequiredCount: 0 });
    expect(readiness.canApproveJob).toBe(true);
    expect(readiness.canExposeDelivery).toBe(false);
  });
});
