import { describe, expect, it } from 'vitest';
import { uploadBatchIntakeRequestSchema, uploadTokenIssueSchema, zipInspectionRequestSchema } from '@/schemas/upload';

describe('phase 8 upload route contract schemas', () => {
  it('parses upload token issue requests with safe defaults', () => {
    const parsed = uploadTokenIssueSchema.parse({ jobId: 'job_1' });
    expect(parsed.maxFiles).toBeGreaterThan(0);
    expect(parsed.allowedMimeTypes).toContain('image/jpeg');
  });

  it('parses upload intake batches and zip inspection requests', () => {
    expect(uploadBatchIntakeRequestSchema.parse({ jobId: 'job_1', files: [{ fileName: 'a.jpg', mimeType: 'image/jpeg', sizeBytes: 1000 }] }).files).toHaveLength(1);
    expect(zipInspectionRequestSchema.parse({ archive: { fileName: 'a.zip', mimeType: 'application/zip', sizeBytes: 1000 }, entries: [{ path: 'a.jpg', sizeBytes: 1000, isDirectory: false }] }).entries).toHaveLength(1);
  });
});
