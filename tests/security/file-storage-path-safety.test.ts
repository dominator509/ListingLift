import { describe, expect, it } from 'vitest';
import { normalizeStoragePath } from '@/domain/file-storage';

describe('file-storage path safety', () => {
  it('rejects path traversal and absolute paths', () => {
    expect(() => normalizeStoragePath('../secret.txt')).toThrow();
    expect(() => normalizeStoragePath('/absolute/secret.txt')).toThrow();
    expect(normalizeStoragePath('safe/folder/file.jpg')).toBe('safe/folder/file.jpg');
  });
});
