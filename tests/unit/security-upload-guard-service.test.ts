import { describe, expect, it } from 'vitest';
import { evaluateSecurityUploadProbe, evaluateSecurityZipProbe } from '@/server/services/security-upload-guard-service';

describe('security upload guard service', () => {
  it('accepts allowlisted product image metadata and preserves parseability as a runtime requirement', () => {
    const result = evaluateSecurityUploadProbe({ fileName: 'sku-front.jpg', mimeType: 'image/jpeg', sizeBytes: 1_000_000, sourceSurface: 'CLIENT_DASHBOARD' });
    expect(result.accepted).toBe(true);
    expect(result.parseabilityCheckRequired).toBe(true);
    expect(result.preserveOriginalRequired).toBe(true);
  });

  it('rejects executable paths and unsupported MIME types', () => {
    const result = evaluateSecurityUploadProbe({ fileName: '../malware.exe', mimeType: 'application/x-msdownload', sizeBytes: 10, sourceSurface: 'PUBLIC_UPLOAD' });
    expect(result.accepted).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain('mime_not_allowlisted');
    expect(result.issues.map((issue) => issue.code)).toContain('unsafe_extension_or_path');
  });

  it('flags ZIP slip paths before extraction', () => {
    const result = evaluateSecurityZipProbe([{ path: '../../escape.png', sizeBytes: 100, isDirectory: false }]);
    expect(result.accepted).toBe(false);
    expect(result.rejectedEntries.length).toBe(1);
  });
});
