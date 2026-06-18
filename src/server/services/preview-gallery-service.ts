import {
  buildPreviewGalleryItem,
  summarizePreviewGallery,
  type PreviewFilterInput,
  type PreviewGalleryItem,
  type PreviewProcessedFileInput,
} from '@/domain/preview-gallery';
import { applyPreviewFilters, buildAvailablePreviewFilters } from './preview-filter-service';
import { buildBeforeAfterPreviewPairs } from './before-after-preview-service';

export type BuildPreviewGalleryInput = {
  organizationId: string;
  jobId: string;
  clientPreviewEnabled?: boolean;
  processedFiles: PreviewProcessedFileInput[];
  filters?: PreviewFilterInput;
};

export function buildPreviewGallery(input: BuildPreviewGalleryInput) {
  const items = input.processedFiles.map((file) => buildPreviewGalleryItem(file, { clientPreviewEnabled: input.clientPreviewEnabled }));
  const filteredItems = applyPreviewFilters(items, input.filters ?? {});
  return {
    organizationId: input.organizationId,
    jobId: input.jobId,
    clientPreviewEnabled: Boolean(input.clientPreviewEnabled),
    summary: summarizePreviewGallery(filteredItems),
    availableFilters: buildAvailablePreviewFilters(items),
    filters: input.filters ?? {},
    beforeAfterPairs: buildBeforeAfterPreviewPairs(filteredItems),
    items: filteredItems,
    safeLanguage: 'Preview only. Platform-ready draft; seller review recommended. No marketplace approval, ranking, conversion, or sales guarantee.',
  };
}

export function buildAdminPreviewGallery(input: BuildPreviewGalleryInput) {
  return buildPreviewGallery({ ...input, clientPreviewEnabled: input.clientPreviewEnabled ?? false });
}

export function buildClientPreviewGallery(input: BuildPreviewGalleryInput) {
  const gallery = buildPreviewGallery({ ...input, clientPreviewEnabled: true });
  const items: PreviewGalleryItem[] = gallery.items.filter((item) => item.clientVisible);
  return {
    ...gallery,
    items,
    beforeAfterPairs: buildBeforeAfterPreviewPairs(items),
    summary: summarizePreviewGallery(items),
    safeLanguage: 'Approved preview only. Seller review recommended before publishing. Final downloads remain governed by delivery approval.',
  };
}
