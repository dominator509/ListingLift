import { buildUpworkDedupeKey, normalizeUpworkContractId } from '@/domain/upwork';
import { upworkRevisionUpdateSchema, type UpworkRevisionUpdateInput } from '@/schemas/upwork';

export function createUpworkRevisionStatusPlan(input: UpworkRevisionUpdateInput) {
  const parsed = upworkRevisionUpdateSchema.parse(input);
  const contractId = normalizeUpworkContractId(parsed.contractId);
  const isOpen = ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'READY_FOR_REVIEW'].includes(parsed.revisionStatus);
  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    contractId,
    dedupeKey: buildUpworkDedupeKey(contractId),
    jobId: parsed.jobId,
    revisionStatus: parsed.revisionStatus,
    blocksCompletion: isOpen,
    workflowEventDraft: {
      provider: 'upwork',
      eventType: 'REVISION_STATUS_UPDATED',
      contractId,
      revisionStatus: parsed.revisionStatus,
      revisionNotes: parsed.revisionNotes,
      requestedAt: parsed.requestedAt,
    },
    auditAction: 'upwork.revision_status_updated',
  };
}
