import { evaluateApprovalReadiness, type ApprovalReadinessInput } from '@/domain/manual-approval';

export function buildApprovalReadiness(input: ApprovalReadinessInput, context: { organizationId: string; actorUserId?: string | null }) {
  const readiness = evaluateApprovalReadiness(input);
  return {
    organizationId: context.organizationId,
    actorUserId: context.actorUserId ?? null,
    ...readiness,
    auditEvent: 'approval.readiness_checked',
    persistenceRequired: true,
  };
}

export function buildApprovalReadinessFromOutputs(input: { jobId: string; outputs: Array<{ approvalStatus?: string | null; status?: string | null; unresolvedBlockingFlags?: number | null; manualReplacementRequired?: boolean | null }> }) {
  const outputCount = input.outputs.length;
  const approvedOutputCount = input.outputs.filter((output) => ['APPROVED'].includes((output.approvalStatus ?? output.status ?? '').toUpperCase())).length;
  const rejectedOutputCount = input.outputs.filter((output) => ['REJECTED'].includes((output.approvalStatus ?? output.status ?? '').toUpperCase())).length;
  const unresolvedBlockingFlags = input.outputs.reduce((sum, output) => sum + (output.unresolvedBlockingFlags ?? 0), 0);
  const manualReplacementRequiredCount = input.outputs.filter((output) => output.manualReplacementRequired).length;
  return evaluateApprovalReadiness({
    jobId: input.jobId,
    outputCount,
    approvedOutputCount,
    rejectedOutputCount,
    unresolvedBlockingFlags,
    openRevisionCount: 0,
    manualReplacementRequiredCount,
    outputs: [],
  });
}
