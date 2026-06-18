import { buildFiverrDedupeKey } from '@/domain/fiverr';
import { fiverrRevisionUpdateSchema, type FiverrRevisionUpdateInput } from '@/schemas/fiverr';

export function buildFiverrRevisionStatusDraft(input: FiverrRevisionUpdateInput) {
  const parsed = fiverrRevisionUpdateSchema.parse(input);
  const blocksCompletion = ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'READY_FOR_REVIEW'].includes(parsed.revisionStatus);
  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    provider: 'fiverr',
    orderId: parsed.orderId,
    dedupeKey: buildFiverrDedupeKey(parsed.orderId),
    jobId: parsed.jobId,
    revisionStatus: parsed.revisionStatus,
    blocksCompletion,
    nextListingLiftStatus: parsed.revisionStatus === 'REQUESTED' ? 'REVISION_REQUESTED' : parsed.revisionStatus === 'IN_PROGRESS' ? 'REPROCESSING' : undefined,
    sanitizedNotes: parsed.revisionNotes?.replace(/[<>]/g, '').trim(),
    auditAction: 'fiverr.revision_status.update',
  };
}
