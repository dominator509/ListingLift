import { describe, expect, it } from 'vitest';
import { validateUploadFile } from '@/lib/file-validation';
import { isZipSlipPath } from '@/lib/zip-security';

describe('upload security', () => {
  it('rejects executable file names', () => {
    const result = validateUploadFile({ fileName: 'malware.exe', mimeType: 'image/jpeg', sizeBytes: 100 });
    expect(result.valid).toBe(false);
  });

  it('detects zip slip paths', () => {
    expect(isZipSlipPath('../escape.jpg')).toBe(true);
    expect(isZipSlipPath('safe/folder/image.jpg')).toBe(false);
  });
});
