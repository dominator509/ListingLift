import { etsyRevisionStatusInputSchema, type EtsyRevisionStatusInput } from '@/schemas/etsy';

export function createEtsyRevisionStatusPlan(input: EtsyRevisionStatusInput) {
  const parsed = etsyRevisionStatusInputSchema.parse(input);
  const blocksCompletion = ['REQUESTED', 'IN_PROGRESS', 'READY_FOR_REVIEW'].includes(parsed.revisionStatus);
  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    orderId: parsed.orderId,
    jobId: parsed.jobId,
    revisionStatus: parsed.revisionStatus,
    blocksCompletion,
    workflowEventDraft: {
      eventType: 'REVISION_STATUS_UPDATED',
      revisionStatus: parsed.revisionStatus,
      notes: parsed.revisionNotes,
    },
    auditRequired: true,
  };
}
