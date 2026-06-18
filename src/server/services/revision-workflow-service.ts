import { sanitizeRevisionText } from '@/domain/manual-approval';
import type { CreateRevisionRequestInput, UpdateRevisionStatusInput } from '@/schemas/manual-approval';

export function buildRevisionRequestDraft(input: CreateRevisionRequestInput, context: { organizationId: string; actorUserId?: string | null }) {
  const requestText = sanitizeRevisionText(input.requestText);
  return {
    organizationId: context.organizationId,
    jobId: input.jobId,
    clientId: input.clientId ?? null,
    imageId: input.imageId ?? null,
    processedFileId: input.processedFileId ?? null,
    requestText,
    requestedBy: input.requestedBy,
    clientVisible: input.clientVisible,
    initialStatus: 'OPEN',
    nextJobStatus: 'REVISION_REQUESTED',
    actorUserId: context.actorUserId ?? null,
    auditEvent: 'revision.request_created',
    requiresTransaction: true,
  };
}

export function buildRevisionStatusUpdate(input: UpdateRevisionStatusInput, context: { organizationId: string; actorUserId?: string | null }) {
  return {
    organizationId: context.organizationId,
    revisionId: input.revisionId,
    status: input.status,
    adminNotes: input.adminNotes ?? null,
    clientMessage: input.clientMessage ?? null,
    reprocessRequested: input.reprocessRequested,
    manualReplacementUploaded: input.manualReplacementUploaded,
    nextJobStatus: input.status === 'RESOLVED' ? 'WAITING_FOR_REVIEW' : input.status === 'IN_PROGRESS' ? 'REPROCESSING' : input.status === 'WAITING_FOR_CLIENT' ? 'REVISION_REQUESTED' : null,
    actorUserId: context.actorUserId ?? null,
    auditEvent: 'revision.status_updated',
    requiresTransaction: true,
  };
}

export function summarizeRevisionQueue(revisions: Array<{ status: string; clientVisible?: boolean | null }>) {
  const open = revisions.filter((revision) => ['OPEN', 'ACCEPTED', 'IN_PROGRESS', 'WAITING_FOR_CLIENT'].includes(revision.status)).length;
  const resolved = revisions.filter((revision) => revision.status === 'RESOLVED').length;
  const clientVisible = revisions.filter((revision) => revision.clientVisible).length;
  return { total: revisions.length, open, resolved, clientVisible, blocksFinalApproval: open > 0 };
}
