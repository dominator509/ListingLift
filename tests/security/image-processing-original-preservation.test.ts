import { describe, expect, it } from 'vitest';
import { assertOriginalPreserved } from '@/domain/image-processing';

describe('original preservation', () => {
  it('rejects output storage keys that overwrite originals', () => {
    expect(() => assertOriginalPreserved({ sourceStorageKey: 'originals/a.jpg', outputStorageKey: 'originals/a.jpg' })).toThrow(/never be overwritten/);
  });

  it('requires processed output namespace', () => {
    expect(() => assertOriginalPreserved({ sourceStorageKey: 'originals/a.jpg', outputStorageKey: 'tmp/a.jpg' })).toThrow(/processed storage namespace/);
  });
});
