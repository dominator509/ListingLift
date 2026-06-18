import { describe, expect, it } from 'vitest';
import { qualityReviewRequestSchema, createQualityFlagSchema, bulkQualityReviewSchema } from '@/schemas/quality-control';

describe('Phase 14 quality-control route contracts', () => {
  it('accepts job QC payloads without client-submitted delivery approval', () => {
    const parsed = qualityReviewRequestSchema.parse({
      jobId: 'job',
      outputs: [{ id: 'pf', outputFileName: 'pf.jpg', status: 'FLAGGED', flags: ['wrong_crop'] }],
    });
    expect(parsed.outputs[0].flags).toEqual(['wrong_crop']);
  });

  it('requires flag messages for manual QC flags', () => {
    expect(() => createQualityFlagSchema.parse({ processedFileId: 'pf', flagKey: 'wrong_crop' })).toThrow();
  });

  it('requires at least one processed file for bulk review', () => {
    expect(() => bulkQualityReviewSchema.parse({ jobId: 'job', processedFileIds: [], decision: 'ACKNOWLEDGE_FLAGS' })).toThrow();
  });
});
