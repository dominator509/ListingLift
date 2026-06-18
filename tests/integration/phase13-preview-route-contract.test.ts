import { describe, expect, it } from 'vitest';
import { previewGalleryRequestSchema, bulkPreviewApprovalRequestSchema } from '@/schemas/preview';

describe('Phase 13 preview route contracts', () => {
  it('accepts dry-run gallery request payloads', () => {
    const parsed = previewGalleryRequestSchema.parse({ jobId: 'job_123', processedFiles: [] });
    expect(parsed.jobId).toBe('job_123');
    expect(parsed.filters.includeFailed).toBe(true);
  });

  it('requires selected files for bulk approval', () => {
    expect(() => bulkPreviewApprovalRequestSchema.parse({ jobId: 'job_123', selectedProcessedFileIds: [], processedFiles: [] })).toThrow();
  });
});
