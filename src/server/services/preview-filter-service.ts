import { filterPreviewItems, type PreviewFilterInput, type PreviewGalleryItem } from '@/domain/preview-gallery';

export function applyPreviewFilters(items: PreviewGalleryItem[], filters: PreviewFilterInput = {}) {
  return filterPreviewItems(items, filters);
}

export function buildAvailablePreviewFilters(items: PreviewGalleryItem[]) {
  return {
    outputTypes: [...new Set(items.map((item) => item.outputType).filter((t): t is string => !!t))].sort(),
    presetKeys: [...new Set(items.map((item) => item.presetKey).filter((k): k is string => !!k))].sort(),
    platforms: [...new Set(items.map((item) => item.platform).filter((p): p is string => !!p))].sort(),
    reviewStatuses: [...new Set(items.map((item) => item.reviewStatus.toLowerCase()))].sort(),
  };
}
