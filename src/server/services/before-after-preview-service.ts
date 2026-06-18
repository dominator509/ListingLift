import { groupBeforeAfterPairs, type BeforeAfterPair, type PreviewGalleryItem } from '@/domain/preview-gallery';

export function buildBeforeAfterPreviewPairs(items: PreviewGalleryItem[]): BeforeAfterPair[] {
  return groupBeforeAfterPairs(items).map((pair) => ({
    ...pair,
    outputs: pair.outputs.sort((a, b) => {
      const scoreA = a.qualityScore ?? 0;
      const scoreB = b.qualityScore ?? 0;
      return scoreB - scoreA;
    }),
  }));
}

export function selectBestBeforeAfterPair(items: PreviewGalleryItem[], imageId: string) {
  return buildBeforeAfterPreviewPairs(items).find((pair) => pair.imageId === imageId) ?? null;
}
