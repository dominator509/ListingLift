import { buildPreviewGalleryItem, type PreviewProcessedFileInput } from '@/domain/preview-gallery';
import { selectBestBeforeAfterPair } from './before-after-preview-service';

export function buildImageDetailPreview(input: { processedFileId: string; processedFiles: PreviewProcessedFileInput[]; clientPreviewEnabled?: boolean }) {
  const items = input.processedFiles.map((file) => buildPreviewGalleryItem(file, { clientPreviewEnabled: input.clientPreviewEnabled }));
  const item = items.find((candidate) => candidate.id === input.processedFileId);
  if (!item) throw new Error('Preview output not found in provided preview set. Codex must replace dry-run lookup with tenant-scoped Prisma query.');
  return {
    item,
    beforeAfter: item.imageId ? selectBestBeforeAfterPair(items, item.imageId) : null,
    adminReviewHints: [
      'Check crop, edge quality, missing parts, background type, file naming, and preset accuracy.',
      'Flag or reject poor outputs instead of making them client-visible.',
      'Preview approval is not final delivery approval.',
    ],
  };
}
