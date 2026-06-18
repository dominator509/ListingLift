import { describe, expect, it } from 'vitest';
import { buildUploadIntakePlan } from '@/server/services/upload-intake-service';

describe('upload intake service', () => {
  it('builds immutable original image drafts and job update plan', () => {
    const plan = buildUploadIntakePlan({
      organizationId: 'org_1',
      clientId: 'client_1',
      jobId: 'job_1',
      sourceKind: 'DIRECT_UPLOAD',
      files: [{ fileName: 'product-front.jpg', mimeType: 'image/jpeg', sizeBytes: 1000, width: 1000, height: 1000 }],
    });
    expect(plan.imageRecordDrafts).toHaveLength(1);
    expect(plan.imageRecordDrafts[0].storageKey).toContain('/originals/');
    expect(plan.storagePolicy.preserveOriginals).toBe(true);
    expect(plan.storagePolicy.finalDeliveryStillRequiresAdminApproval).toBe(true);
    expect(plan.jobUpdateDraft.uploadStatus).toBe('COMPLETE');
  });
});
