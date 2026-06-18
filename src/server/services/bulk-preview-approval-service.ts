import { buildBulkPreviewApprovalDraft, type PreviewProcessedFileInput } from '@/domain/preview-gallery';
import { buildPreviewGallery } from './preview-gallery-service';

export function buildBulkPreviewApprovalPlan(input: {
  organizationId: string;
  jobId: string;
  selectedProcessedFileIds: string[];
  processedFiles: PreviewProcessedFileInput[];
  actorUserId?: string | null;
  note?: string;
}) {
  const gallery = buildPreviewGallery({
    organizationId: input.organizationId,
    jobId: input.jobId,
    clientPreviewEnabled: false,
    processedFiles: input.processedFiles,
  });
  const draft = buildBulkPreviewApprovalDraft(gallery.items, input.selectedProcessedFileIds, input.actorUserId);
  return {
    ...draft,
    jobId: input.jobId,
    note: input.note ?? null,
    nextDatabaseActions: draft.approvableIds.map((processedFileId) => ({
      processedFileId,
      setApprovedStatus: 'APPROVED',
      setStatusIfNeeded: 'APPROVED',
      auditEvent: 'preview.output_approved',
    })),
  };
}
