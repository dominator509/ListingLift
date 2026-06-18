import { describe, expect, it } from 'vitest';

describe('phase 31 advanced image route contract', () => {
  it('documents required dry-run route contracts for Codex wiring', () => {
    const routes = [
      '/api/advanced-image-processing/recipes',
      '/api/advanced-image-processing/plan',
      '/api/advanced-image-processing/jobs/[jobId]/queue',
      '/api/advanced-image-processing/images/[imageId]/process',
      '/api/advanced-image-processing/reports/[jobId]',
      '/api/advanced-image-processing/safety-check',
      '/api/advanced-image-processing/health',
    ];
    expect(routes).toContain('/api/advanced-image-processing/plan');
    expect(routes).toContain('/api/advanced-image-processing/safety-check');
  });
});
