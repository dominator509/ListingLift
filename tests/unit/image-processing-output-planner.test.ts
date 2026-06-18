import { describe, expect, it } from 'vitest';
import { buildProcessingRunPlan } from '@/server/services/image-processing-output-planner';

const job = { id: 'job_1', organizationId: 'org_1', jobNumber: 'JOB-001', selectedPresetKeys: ['TransparentPngCutout', 'WhiteJpgCatalog'] };
const image = { id: 'img_1', organizationId: 'org_1', jobId: 'job_1', originalName: 'Messy Product.JPG', storageKey: 'originals/img_1.jpg', mimeType: 'image/jpeg' };

describe('buildProcessingRunPlan', () => {
  it('creates preset-driven outputs without overwriting originals', () => {
    const plan = buildProcessingRunPlan({ job, images: [image], providerKey: 'mock-image-provider' });
    expect(plan.outputCount).toBe(2);
    expect(plan.outputs.every((output) => output.storageKey !== image.storageKey)).toBe(true);
    expect(plan.outputs.every((output) => output.storageKey.includes('processed/'))).toBe(true);
  });

  it('marks outputs as seller-review required by default', () => {
    const plan = buildProcessingRunPlan({ job, images: [image] });
    expect(plan.outputs.every((output) => output.sellerReviewRequired)).toBe(true);
  });
});
