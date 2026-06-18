import { describe, expect, it } from 'vitest';
import { deliveryArchivePlanRequestSchema } from '@/schemas/delivery-packaging';

describe('phase 12 delivery archive route contract', () => {
  it('requires server-side job and organization context for dry-run archive plans', () => {
    const parsed = deliveryArchivePlanRequestSchema.parse({ organizationId: 'org1', jobId: 'job1', clientName: 'Client', processedFiles: [] });
    expect(parsed.includeManifest).toBe(true);
    expect(parsed.includeReadme).toBe(true);
  });
});
