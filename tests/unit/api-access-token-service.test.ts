import { describe, expect, it } from 'vitest';
import { hashApiToken, issueApiTokenDraft, redactedApiTokenRecord, verifyApiTokenAgainstRecord } from '@/server/services/api-access-token-service';

describe('api access token service', () => {
  it('issues a raw token once and stores only a hash candidate', () => {
    const draft = issueApiTokenDraft({ organizationId: 'org_1', createdByUserId: 'user_1', label: 'Agency API', scopes: ['jobs:create', 'jobs:read'], planKey: 'AGENCY', showOnceAcknowledged: true });
    expect(draft.token).toMatch(/^ll_api_/);
    expect(draft.record.tokenHash).toEqual(hashApiToken(draft.token));
    expect(draft.record.metadata.rawTokenStored).toBe(false);
    const safe = redactedApiTokenRecord(draft.record);
    expect(safe.tokenHash).toBe('[redacted-hash]');
  });

  it('validates hash, status, expiry, and revocation', () => {
    const token = 'll_api_test_token';
    const record = { tokenHash: hashApiToken(token), status: 'ACTIVE', expiresAt: '2099-01-01T00:00:00.000Z' };
    expect(verifyApiTokenAgainstRecord(token, record).valid).toBe(true);
    expect(verifyApiTokenAgainstRecord(`${token}-wrong`, record).reason).toBe('hash_mismatch');
    expect(verifyApiTokenAgainstRecord(token, { ...record, status: 'REVOKED' }).reason).toBe('inactive_token');
    expect(verifyApiTokenAgainstRecord(token, { ...record, expiresAt: '2000-01-01T00:00:00.000Z' }).reason).toBe('expired');
    expect(verifyApiTokenAgainstRecord(token, { ...record, revokedAt: new Date() }).reason).toBe('revoked');
  });
});
