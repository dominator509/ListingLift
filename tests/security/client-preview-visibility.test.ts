import { describe, expect, it } from 'vitest';
import { buildClientPreviewGallery } from '@/server/services/preview-gallery-service';

describe('client preview visibility', () => {
  it('does not expose pending, flagged, failed, or rejected previews to clients', () => {
    const gallery = buildClientPreviewGallery({
      organizationId: 'org',
      jobId: 'job',
      clientPreviewEnabled: true,
      processedFiles: [
        { id: 'approved', outputFileName: 'approved.jpg', outputType: 'WHITE_JPG', status: 'APPROVED', approvedStatus: 'APPROVED' },
        { id: 'pending', outputFileName: 'pending.jpg', outputType: 'WHITE_JPG', status: 'READY_FOR_REVIEW', approvedStatus: 'PENDING' },
        { id: 'flagged', outputFileName: 'flagged.jpg', outputType: 'WHITE_JPG', status: 'FLAGGED', approvedStatus: 'PENDING' },
        { id: 'failed', outputFileName: 'failed.jpg', outputType: 'WHITE_JPG', status: 'FAILED', approvedStatus: 'PENDING' },
      ],
    });
    expect(gallery.items.map((item) => item.id)).toEqual(['approved']);
  });
});
