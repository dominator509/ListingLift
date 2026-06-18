import { buildManualJobApprovalEvent, evaluateApprovalReadiness } from '@/domain/manual-approval';
import type { ManualJobApprovalInput } from '@/schemas/manual-approval';

export function buildManualApprovalDecision(input: ManualJobApprovalInput, context: { organizationId: string; actorUserId?: string | null }) {
  const readiness = input.readiness ?? evaluateApprovalReadiness({
    jobId: input.jobId,
    outputCount: 0,
    approvedOutputCount: 0,
    rejectedOutputCount: 0,
    unresolvedBlockingFlags: 0,
    openRevisionCount: 0,
    manualReplacementRequiredCount: 0,
    outputs: [],
  });
  const event = buildManualJobApprovalEvent({ jobId: input.jobId, decision: input.decision, actorUserId: context.actorUserId, notes: input.notes, readiness: readiness });
  return {
    organizationId: context.organizationId,
    ...event,
    deliveryNotes: input.deliveryNotes ?? null,
    requiresAuditLog: true,
    requiresTransaction: true,
    clientDownloadsRemainHidden: true,
  };
}

export function assertManualApprovalCanProceed(input: { decision: string; readiness: { canApproveJob: boolean; blockers: string[] } }) {
  if (input.decision === 'APPROVE_JOB' && !input.readiness.canApproveJob) {
    throw new Error(`Job cannot be approved until blockers are resolved: ${input.readiness.blockers.join('; ') || 'unknown blocker'}`);
  }
  return true;
}
