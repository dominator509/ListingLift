import { describe, expect, it } from 'vitest';
import { buildDeliveryApprovalGate } from '@/server/services/delivery-approval-gate-service';
import { evaluateApprovalReadiness } from '@/domain/manual-approval';

describe('approval delivery gate', () => {
  it('does not expose delivery with approval alone', () => {
    const readiness = evaluateApprovalReadiness({ jobId: 'job-1', outputCount: 1, approvedOutputCount: 1, rejectedOutputCount: 0, unresolvedBlockingFlags: 0, openRevisionCount: 0, manualReplacementRequiredCount: 0 });
    const gate = buildDeliveryApprovalGate({ jobId: 'job-1', jobApproved: true, approvalReadiness: readiness, deliveryArchiveApproved: false, deliveryLinkActive: false });
    expect(gate.canExposeClientDownload).toBe(false);
    expect(gate.blockers).toContain('Delivery archive has not been approved for release.');
  });
});
