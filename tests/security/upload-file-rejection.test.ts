import { describe, expect, it } from 'vitest';
import { isUnsafeFileName, sanitizeUploadFileName } from '@/domain/upload-intake';
import { assertStorageKeySafe } from '@/server/services/upload-storage-key-service';

describe('upload file rejection security contract', () => {
  it('treats executable and traversal file names as unsafe', () => {
    expect(isUnsafeFileName('../product.jpg')).toBe(true);
    expect(isUnsafeFileName('cleanup.js')).toBe(true);
    expect(isUnsafeFileName('product.jpg')).toBe(false);
  });

  it('generates safe file names and rejects unsafe storage keys', () => {
    expect(sanitizeUploadFileName('new product photo (1).jpg')).toBe('new-product-photo-1.jpg');
    expect(() => assertStorageKeySafe('../bad')).toThrow(/Unsafe storage key/i);
  });
});
