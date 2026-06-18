import { describe, expect, it } from 'vitest';
import { hashUploadToken, validateUploadTokenRecord } from '@/server/services/upload-token-service';

describe('upload token service', () => {
  it('validates token hash without storing public token', () => {
    const token = 'public-upload-token-value-with-length';
    const record = { tokenHash: hashUploadToken(token), expiresAt: new Date('2099-01-01T00:00:00.000Z') };
    expect(validateUploadTokenRecord(token, record).valid).toBe(true);
    expect(validateUploadTokenRecord(`${token}-wrong`, record).reason).toBe('hash_mismatch');
  });

  it('rejects expired, used, and revoked token records', () => {
    const token = 'public-upload-token-value-with-length';
    expect(validateUploadTokenRecord(token, { tokenHash: hashUploadToken(token), expiresAt: new Date('2000-01-01T00:00:00.000Z') }).reason).toBe('expired');
    expect(validateUploadTokenRecord(token, { tokenHash: hashUploadToken(token), expiresAt: new Date('2099-01-01T00:00:00.000Z'), usedAt: new Date() }).reason).toBe('already_used');
    expect(validateUploadTokenRecord(token, { tokenHash: hashUploadToken(token), expiresAt: new Date('2099-01-01T00:00:00.000Z'), revokedAt: new Date() }).reason).toBe('revoked');
  });
});
