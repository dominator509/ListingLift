import { describe, expect, it } from 'vitest';
import { buildAdvancedImageProcessingPlan } from '../../src/server/services/advanced-image-plan-service';

describe('advanced image processing plan service', () => {
  it('plans outputs without exposing them by default', () => {
    const result = buildAdvancedImageProcessingPlan({
      jobId: 'job_123',
      recipeKey: 'marketplace-polish',
      sourceFiles: [{ imageId: 'img_1', originalFilename: 'Messy Product.JPG', status: 'READY_FOR_REVIEW' }],
      brandColors: [],
      targetPlatforms: ['Amazon'],
      includeQualityReport: true,
      includeSequenceRecommendations: false,
      manualFallbackAllowed: true,
    });
    expect(result.plan?.requiresAdminApproval).toBe(true);
    expect(result.plan?.outputSteps.every((step) => step.clientVisibleByDefault === false)).toBe(true);
    expect(result.plan?.safeClaim.toLowerCase()).not.toContain('guaranteed');
  });
});
