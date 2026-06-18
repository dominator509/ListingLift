import { socialCommerceRevisionStatusInputSchema } from '@/schemas/social-commerce';

export function createSocialCommerceRevisionStatusDraft(input: unknown) {
  const parsed = socialCommerceRevisionStatusInputSchema.parse(input);
  return {
    channelKey: parsed.channelKey,
    jobId: parsed.jobId,
    revisionStatus: parsed.revisionStatus,
    revisionNotes: parsed.revisionNotes?.trim(),
    blocksCompletion: ['REQUESTED', 'IN_PROGRESS', 'READY_FOR_REVIEW'].includes(parsed.revisionStatus),
    auditEvent: {
      type: 'REVISION_STATUS_UPDATED',
      payload: parsed,
    },
  };
}
