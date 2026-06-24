import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateCsrfToken, verifyCsrfForRequest, CsrfRejectionError } from '@/server/services/csrf-protection-service';

const session = {
  userId: 'user_qa',
  organizationId: 'org_qa',
};

function mutationRequest(token?: string, origin = 'http://localhost:3000') {
  return new Request('http://localhost:3000/api/jobs', {
    method: 'POST',
    headers: {
      ...(token ? { 'x-csrf-token': token } : {}),
      origin,
    },
  });
}

describe('CSRF protection integration', () => {
  beforeEach(() => {
    vi.stubEnv('CSRF_SECRET', 'test-csrf-secret-that-is-at-least-32-chars-long!!');
    vi.stubEnv('CSRF_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3005');
  });

  it('rejects mutations without a CSRF token', () => {
    expect(() => verifyCsrfForRequest(mutationRequest(), session)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(mutationRequest(), session);
    } catch (error) {
      expect((error as CsrfRejectionError).code).toBe('CSRF_TOKEN_MISSING');
    }
  });

  it('accepts mutations with a valid session-bound CSRF token', () => {
    const { token } = generateCsrfToken(session);

    expect(() => verifyCsrfForRequest(mutationRequest(token), session)).not.toThrow();
  });

  it('rejects forged CSRF tokens', () => {
    expect(() => verifyCsrfForRequest(mutationRequest('attackertoken.9999999999.wrongsignature'), session)).toThrow(
      CsrfRejectionError
    );
    try {
      verifyCsrfForRequest(mutationRequest('attackertoken.9999999999.wrongsignature'), session);
    } catch (error) {
      expect((error as CsrfRejectionError).code).toBe('CSRF_TOKEN_INVALID');
    }
  });

  it('rejects expired CSRF tokens', () => {
    const expiresAt = Date.now() - 1000;
    const expiredToken = `nonce.${expiresAt}.deadbeefdeadbeefdeadbeefdeadbeef`;

    expect(() => verifyCsrfForRequest(mutationRequest(expiredToken), session)).toThrow(CsrfRejectionError);
  });

  it('rejects cross-origin mutation requests even with a valid token', () => {
    const { token } = generateCsrfToken(session);

    expect(() => verifyCsrfForRequest(mutationRequest(token, 'https://evil.example'), session)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(mutationRequest(token, 'https://evil.example'), session);
    } catch (error) {
      expect((error as CsrfRejectionError).code).toBe('CSRF_ORIGIN_MISMATCH');
    }
  });

  it('does not require CSRF tokens for safe methods', () => {
    const request = new Request('http://localhost:3000/api/jobs', { method: 'GET' });

    expect(() => verifyCsrfForRequest(request, session)).not.toThrow();
  });
});
