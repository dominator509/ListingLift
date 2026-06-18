import { describe, expect, it } from 'vitest';
import { buildPreviewGallery } from '@/server/services/preview-gallery-service';

const processedFiles = [
  { id: 'a', imageId: 'img1', outputFileName: 'a.jpg', outputType: 'WHITE_JPG', status: 'READY_FOR_REVIEW', approvedStatus: 'PENDING', presetKey: 'AmazonMainImageDraft', platform: 'Amazon' },
  { id: 'b', imageId: 'img1', outputFileName: 'b.png', outputType: 'TRANSPARENT_PNG', status: 'APPROVED', approvedStatus: 'APPROVED', presetKey: 'TransparentPngCutout', platform: 'Transparent-PNG' },
  { id: 'c', imageId: 'img2', outputFileName: 'c.jpg', outputType: 'SQUARE_ECOMMERCE', status: 'FLAGGED', approvedStatus: 'PENDING', qualityFlags: ['edge_artifact'] },
];

describe('buildPreviewGallery', () => {
  it('summarizes admin preview states and before/after pairs', () => {
    const gallery = buildPreviewGallery({ organizationId: 'org', jobId: 'job', clientPreviewEnabled: true, processedFiles });
    expect(gallery.summary.total).toBe(3);
    expect(gallery.summary.approved).toBe(1);
    expect(gallery.summary.flagged).toBe(1);
    expect(gallery.summary.beforeAfterPairs).toBe(2);
  });

  it('filters by output type', () => {
    const gallery = buildPreviewGallery({ organizationId: 'org', jobId: 'job', processedFiles, filters: { outputTypes: ['WHITE_JPG'] } });
    expect(gallery.items.map((item) => item.id)).toEqual(['a']);
  });
});
