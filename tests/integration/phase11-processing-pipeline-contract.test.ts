import { describe, expect, it } from 'vitest';
import { runCoreImageProcessingPipeline } from '@/server/services/core-image-processing-pipeline-service';

describe('Phase 11 processing pipeline contract', () => {
  it('runs with the mock provider and creates review-ready processed file drafts', async () => {
    const result = await runCoreImageProcessingPipeline({
      dryRun: true,
      providerKey: 'mock-image-provider',
      job: { id: 'job_1', organizationId: 'org_1', jobNumber: 'JOB-001', selectedPresetKeys: ['TransparentPngCutout'] },
      images: [{ id: 'img_1', organizationId: 'org_1', jobId: 'job_1', originalName: 'Product.jpg', storageKey: 'originals/product.jpg', mimeType: 'image/jpeg' }],
    });
    expect(result.run.status).toBe('COMPLETED');
    expect(result.processedFiles).toHaveLength(1);
    expect(result.processedFiles[0].approvedStatus).toBe('PENDING');
    expect(result.nextJobStatus).toBe('WAITING_FOR_REVIEW');
  });
});
