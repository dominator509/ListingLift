import { describe, expect, it } from 'vitest';
import { planTenantStorageKey } from '@/server/services/file-storage-access-service';

describe('file-storage access service', () => {
  it('builds tenant-scoped storage keys', () => {
    const key = planTenantStorageKey({ organizationId: 'org_1', jobId: 'job_1', objectKind: 'ORIGINAL_UPLOAD', fileName: 'Raw Product Photo 01.JPG' });
    expect(key).toContain('org/org_1/job-job_1/original_upload/raw-product-photo-01.jpg');
  });
});
