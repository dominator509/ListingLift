import { describe, expect, it } from 'vitest';
import { mockImageProvider } from '@/server/adapters/image/mock-image-provider';

describe('image provider adapter contract', () => {
  it('mock provider returns a successful processed image result', async () => {
    const health = await mockImageProvider.healthCheck();
    expect(health.ok).toBe(true);
    const result = await mockImageProvider.processImage({ inputStorageKey: 'raw/a.jpg', outputBaseKey: 'processed/job', operations: ['remove-background'], presetKey: 'transparent-png-original' });
    expect(result.ok).toBe(true);
    expect(result.outputStorageKey).toContain('transparent-png-original');
  });
});
