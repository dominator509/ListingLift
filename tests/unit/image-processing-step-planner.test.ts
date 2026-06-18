import { describe, expect, it } from 'vitest';
import { buildProcessingRunPlan } from '@/server/services/image-processing-output-planner';
import { buildProcessingSteps, summarizeProcessingSteps } from '@/server/services/image-processing-step-planner';

describe('buildProcessingSteps', () => {
  it('creates ordered steps for outputs', () => {
    const plan = buildProcessingRunPlan({
      job: { id: 'job_1', organizationId: 'org_1', selectedPresetKeys: ['WhiteJpgCatalog'] },
      images: [{ id: 'img_1', organizationId: 'org_1', jobId: 'job_1', originalName: 'Image.jpg', storageKey: 'originals/image.jpg', mimeType: 'image/jpeg' }],
    });
    const steps = buildProcessingSteps(plan);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.at(-1)?.operation).toBe('preset-output');
    expect(summarizeProcessingSteps(steps).planned).toBe(steps.length);
  });
});
