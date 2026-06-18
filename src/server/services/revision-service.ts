import { revisionRequestCreateSchema, revisionStatusSchema, type RevisionRequestCreateInput, type RevisionStatus } from '@/schemas/revision';

export function createRevisionRequestDraft(input: RevisionRequestCreateInput) {
  const data = revisionRequestCreateSchema.parse(input);
  return { ...data, status: 'open' as RevisionStatus, createdAt: new Date().toISOString() };
}

export function assertRevisionStatus(status: RevisionStatus) {
  return revisionStatusSchema.parse(status);
}
