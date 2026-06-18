import { describe, expect, it } from 'vitest';
import { ADVANCED_IMAGE_SECURITY_RULES } from '../../src/domain/advanced-image-processing';

describe('advanced image original preservation', () => {
  it('keeps original preservation as a required rule', () => {
    expect(ADVANCED_IMAGE_SECURITY_RULES.join(' ')).toContain('Never overwrite original uploads');
  });
});
