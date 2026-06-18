import { describe, expect, it } from 'vitest';
import { runAdvancedImageSafetyCheck } from '../../src/server/services/advanced-image-safety-service';

describe('advanced image processing safety', () => {
  it('blocks auto-publishing and guarantee copy', () => {
    const result = runAdvancedImageSafetyCheck({
      operationKeys: ['HERO_COMPOSITE'],
      proposedCopy: 'Guaranteed approval and conversion guaranteed',
      includesAutoPublish: true,
      includesProductAlteration: false,
      exposesClientFiles: false,
      exposesUnapprovedOutputs: false,
    });
    expect(result.allowed).toBe(false);
    expect(result.errors.join(' ')).toContain('auto-publish');
  });
});
