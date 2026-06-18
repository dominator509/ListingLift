import { describe, expect, it } from 'vitest';
import { buildAdvancedImageQualityReport } from '../../src/server/services/advanced-image-quality-report-service';

describe('advanced image quality report service', () => {
  it('uses seller-review and non-guarantee language', () => {
    const report = buildAdvancedImageQualityReport({ jobId: 'job_1', imageCount: 5, approvedCount: 4, flaggedCount: 1 });
    expect(report.warnings.length).toBeGreaterThan(0);
    expect(report.safeClaim).toContain('not a guarantee');
    expect(report.safeClaim.toLowerCase()).not.toContain('guaranteed approval');
  });
});
