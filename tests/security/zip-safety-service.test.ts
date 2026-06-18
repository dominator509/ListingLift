import { describe, expect, it } from 'vitest';
import { isZipSlipPath, validateZipEntries } from '@/server/services/zip-safety-service';

describe('zip safety service', () => {
  it('detects zip slip traversal paths', () => {
    expect(isZipSlipPath('../evil.jpg')).toBe(true);
    expect(isZipSlipPath('/absolute/evil.jpg')).toBe(true);
    expect(isZipSlipPath('safe/product.jpg')).toBe(false);
  });

  it('rejects executable and nested archive entries', () => {
    const result = validateZipEntries([
      { path: 'safe/product.jpg', sizeBytes: 1000, isDirectory: false },
      { path: 'safe/script.sh', sizeBytes: 1000, isDirectory: false },
      { path: 'safe/nested.zip', sizeBytes: 1000, isDirectory: false },
    ]);
    expect(result.safeEntries).toHaveLength(1);
    expect(result.rejectedEntries.length).toBeGreaterThanOrEqual(2);
  });
});
