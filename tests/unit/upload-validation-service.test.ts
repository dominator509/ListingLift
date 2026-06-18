import { describe, expect, it } from 'vitest';
import { validateSingleUploadFile, validateUploadBatch } from '@/server/services/upload-validation-service';

const jpg = { fileName: 'product-front.jpg', mimeType: 'image/jpeg' as const, sizeBytes: 1_000_000, width: 1200, height: 1200 };

describe('upload validation service', () => {
  it('accepts supported image uploads', () => {
    const result = validateSingleUploadFile(jpg);
    expect(result.accepted).toBe(true);
    expect(result.uploadKind).toBe('DIRECT_IMAGE');
  });

  it('rejects unsafe executable names even if metadata is supplied', () => {
    const result = validateSingleUploadFile({ fileName: 'invoice.exe', mimeType: 'image/jpeg', sizeBytes: 1000 });
    expect(result.accepted).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'unsafe_filename')).toBe(true);
  });

  it('enforces package image allowance at batch level', () => {
    const result = validateUploadBatch([jpg, { ...jpg, fileName: 'product-side.jpg' }], { packageImageAllowance: 1 });
    expect(result.accepted).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'package_allowance_exceeded')).toBe(true);
  });
});
