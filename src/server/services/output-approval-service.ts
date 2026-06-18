import { buildOutputApprovalEvent } from '@/domain/manual-approval';
import type { OutputApprovalInput } from '@/schemas/manual-approval';

export function buildOutputApprovalDecision(input: OutputApprovalInput, context: { organizationId: string; jobId?: string | null; actorUserId?: string | null }) {
  const event = buildOutputApprovalEvent({ processedFileId: input.processedFileId, decision: input.decision, actorUserId: context.actorUserId, notes: input.notes });
  return {
    organizationId: context.organizationId,
    jobId: context.jobId ?? null,
    ...event,
    replacementRequired: input.replacementRequired || input.decision === 'REQUEST_MANUAL_REPLACEMENT',
    reprocessRequested: input.reprocessRequested || input.decision === 'REQUEST_REPROCESS',
    requiresAuditLog: true,
    requiresProcessedFileStatusUpdate: true,
    warning: 'Output approval does not expose client delivery links or complete the job.',
  };
}
