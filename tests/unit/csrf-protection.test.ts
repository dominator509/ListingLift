import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  generateCsrfToken,
  verifyCsrfForRequest,
  originAllowedForRequest,
  CsrfRejectionError,
  createCsrfTokenDraft,
  verifyCsrfTokenDraft,
} from '../../src/server/services/csrf-protection-service';

const mockSession = { userId: 'user_abc123', organizationId: 'org_xyz789' };

beforeEach(() => {
  vi.stubEnv('CSRF_SECRET', 'test-csrf-secret-that-is-at-least-32-chars-long!!');
  vi.stubEnv('CSRF_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3005');
});

describe('generateCsrfToken', () => {
  it('returns a token with nonce, expiresAt, and signature separated by dots', () => {
    const { token } = generateCsrfToken(mockSession);
    const parts = token.split('.');
    expect(parts).toHaveLength(3);
    expect(parts[0].length).toBeGreaterThan(0); // nonce
    expect(parts[1]).toMatch(/^\d+$/); // epoch ms
    expect(parts[2].length).toBeGreaterThan(0); // sig
  });

  it('sets expiresAt approximately 30 minutes in the future', () => {
    const { expiresAt } = generateCsrfToken(mockSession);
    const now = Date.now();
    expect(expiresAt - now).toBeGreaterThan(29 * 60 * 1000);
    expect(expiresAt - now).toBeLessThanOrEqual(31 * 60 * 1000);
  });

  it('produces different tokens for different sessions', () => {
    const token1 = generateCsrfToken(mockSession);
    const token2 = generateCsrfToken({ userId: 'user_other', organizationId: 'org_other' });
    expect(token1.token).not.toBe(token2.token);
  });

  it('produces different tokens for same session (nonce changes)', () => {
    const token1 = generateCsrfToken(mockSession);
    const token2 = generateCsrfToken(mockSession);
    expect(token1.token).not.toBe(token2.token);
  });
});

describe('verifyCsrfForRequest — safe methods skip CSRF', () => {
  ['GET', 'HEAD', 'OPTIONS'].forEach((method) => {
    it(`allows ${method} requests without a CSRF token`, () => {
      const request = new Request('http://localhost:3000/api/test', { method });
      expect(() => verifyCsrfForRequest(request, mockSession)).not.toThrow();
    });
  });
});

describe('verifyCsrfForRequest — missing token', () => {
  it('throws CsrfRejectionError when x-csrf-token header is missing', () => {
    const request = new Request('http://localhost:3000/api/test', { method: 'POST' });
    expect(() => verifyCsrfForRequest(request, mockSession)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(request, mockSession);
    } catch (e: unknown) {
      expect((e as CsrfRejectionError).code).toBe('CSRF_TOKEN_MISSING');
    }
  });
});

describe('verifyCsrfForRequest — malformed token', () => {
  it('throws when token does not have 3 dot-separated parts', () => {
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': 'only-two-parts' },
    });
    expect(() => verifyCsrfForRequest(request, mockSession)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(request, mockSession);
    } catch (e: unknown) {
      expect((e as CsrfRejectionError).code).toBe('CSRF_TOKEN_MALFORMED');
    }
  });

  it('throws when token has more than 3 parts', () => {
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': 'a.b.c.d' },
    });
    expect(() => verifyCsrfForRequest(request, mockSession)).toThrow(CsrfRejectionError);
  });
});

describe('verifyCsrfForRequest — valid token round-trip', () => {
  it('accepts a freshly generated token', () => {
    const { token } = generateCsrfToken(mockSession);
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': token },
    });
    expect(() => verifyCsrfForRequest(request, mockSession)).not.toThrow();
  });

  it('rejects token for different userId', () => {
    const { token } = generateCsrfToken(mockSession);
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': token },
    });
    expect(() => verifyCsrfForRequest(request, { userId: 'user_different', organizationId: 'org_xyz789' }))
      .toThrow(CsrfRejectionError);
  });

  it('rejects token for different organizationId', () => {
    const { token } = generateCsrfToken(mockSession);
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': token },
    });
    expect(() => verifyCsrfForRequest(request, { userId: 'user_abc123', organizationId: 'org_different' }))
      .toThrow(CsrfRejectionError);
  });
});

describe('verifyCsrfForRequest — expiration', () => {
  it('rejects an expired token', () => {
    vi.useFakeTimers();
    const { token } = generateCsrfToken(mockSession);
    // Advance clock past 30 minute window
    vi.advanceTimersByTime(31 * 60 * 1000 + 1);
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': token },
    });
    expect(() => verifyCsrfForRequest(request, mockSession)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(request, mockSession);
    } catch (e: unknown) {
      expect((e as CsrfRejectionError).code).toBe('CSRF_TOKEN_EXPIRED');
    }
    vi.useRealTimers();
  });
});

describe('verifyCsrfForRequest — invalid signature', () => {
  it('rejects tampered token signature', () => {
    const { token } = generateCsrfToken(mockSession);
    const parts = token.split('.');
    const tampered = `${parts[0]}.${parts[1]}.a0b1c2d3e4f5a0b1c2d3e4f5`;
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': tampered },
    });
    expect(() => verifyCsrfForRequest(request, mockSession)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(request, mockSession);
    } catch (e: unknown) {
      expect((e as CsrfRejectionError).code).toBe('CSRF_TOKEN_INVALID');
    }
  });
});

describe('verifyCsrfForRequest — origin check (skipOriginCheck)', () => {
  it('skips origin check when skipOriginCheck is true', () => {
    const { token } = generateCsrfToken(mockSession);
    const request = new Request('http://evil-site.com/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': token, origin: 'http://evil-site.com' },
    });
    expect(() => verifyCsrfForRequest(request, mockSession, { skipOriginCheck: true })).not.toThrow();
  });
});

describe('originAllowedForRequest — origin/referer validation', () => {
  it('allows same-origin requests without Origin header (non-CORS fetch)', () => {
    const request = new Request('http://localhost:3000/api/test');
    expect(originAllowedForRequest(request)).toBe(true);
  });

  it('allows request with allowed origin', () => {
    const request = new Request('http://localhost:3000/api/test', {
      headers: { origin: 'http://localhost:3000' },
    });
    expect(originAllowedForRequest(request)).toBe(true);
  });

  it('allows request with allowed alternate origin', () => {
    const request = new Request('http://localhost:3005/api/test', {
      headers: { origin: 'http://localhost:3005' },
    });
    expect(originAllowedForRequest(request)).toBe(true);
  });

  it('blocks request from disallowed origin', () => {
    const request = new Request('http://localhost:3000/api/test', {
      headers: { origin: 'http://evil-site.com' },
    });
    expect(originAllowedForRequest(request)).toBe(false);
  });

  it('checks referer when origin is absent', () => {
    const request = new Request('http://localhost:3000/api/test', {
      headers: { referer: 'http://localhost:3000/dashboard' },
    });
    expect(originAllowedForRequest(request)).toBe(true);
  });

  it('blocks disallowed referer', () => {
    const request = new Request('http://localhost:3000/api/test', {
      headers: { referer: 'http://evil.com/page' },
    });
    expect(originAllowedForRequest(request)).toBe(false);
  });

  it('handles malformed origin URL gracefully', () => {
    const request = new Request('http://localhost:3000/api/test', {
      headers: { origin: 'http://not a valid url with spaces' },
    });
    expect(originAllowedForRequest(request)).toBe(false);
  });
});

describe('CsrfRejectionError', () => {
  it('carries code and message', () => {
    const err = new CsrfRejectionError('CSRF_TEST', 'test message');
    expect(err.code).toBe('CSRF_TEST');
    expect(err.message).toBe('test message');
    expect(err.name).toBe('CsrfRejectionError');
  });
});

describe('createCsrfTokenDraft / verifyCsrfTokenDraft — draft API', () => {
  const draftInput = {
    sessionId: 'sess_' + 'a'.repeat(8),
    organizationId: 'org_abc',
    csrfSecret: 'test-secret-that-is-at-least-32-bytes-long!',
    expiresInMinutes: 120,
  };

  it('creates a draft token with hash and expiry', () => {
    const draft = createCsrfTokenDraft(draftInput);
    expect(draft.token).toBeTruthy();
    expect(draft.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(draft.expiresAt).toBeInstanceOf(Date);
    expect(draft.rawTokenStored).toBe(false);
  });

  it('verifies a valid draft token', () => {
    const draft = createCsrfTokenDraft(draftInput);
    const result = verifyCsrfTokenDraft({
      sessionId: draftInput.sessionId,
      organizationId: draftInput.organizationId,
      csrfSecret: draftInput.csrfSecret,
      token: draft.token,
    });
    expect(result.ok).toBe(true);
    expect(result.reason).toBeNull();
    expect(result.expiresAt).toBeInstanceOf(Date);
  });

  it('rejects malformed token with wrong parts', () => {
    const result = verifyCsrfTokenDraft({
      sessionId: draftInput.sessionId,
      organizationId: draftInput.organizationId,
      csrfSecret: draftInput.csrfSecret,
      token: 'a'.repeat(20),
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('malformed_token');
  });

  it('rejects expired draft token', () => {
    const draft = createCsrfTokenDraft({ ...draftInput, expiresInMinutes: 1 });
    // Advance past the expiry window
    const futureIso = new Date(Date.now() + 120_000).toISOString();
    const result = verifyCsrfTokenDraft({
      sessionId: draftInput.sessionId,
      organizationId: draftInput.organizationId,
      csrfSecret: draftInput.csrfSecret,
      token: draft.token,
      nowIso: futureIso,
    });
    // Should be expired since token was created 1 minute ago and we passed nowIso 2 min ahead
    expect(result.ok).toBe(false);
    expect(['expired', 'malformed_expiry', 'signature_mismatch']).toContain(result.reason);
  });

  it('rejects token with wrong sessionId', () => {
    const draft = createCsrfTokenDraft(draftInput);
    const result = verifyCsrfTokenDraft({
      sessionId: 'sess_' + 'b'.repeat(8),
      organizationId: draftInput.organizationId,
      csrfSecret: draftInput.csrfSecret,
      token: draft.token,
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('signature_mismatch');
  });

  it('rejects token with wrong secret', () => {
    const draft = createCsrfTokenDraft(draftInput);
    const result = verifyCsrfTokenDraft({
      sessionId: draftInput.sessionId,
      organizationId: draftInput.organizationId,
      csrfSecret: 'different-secret-that-is-also-thirty-two-bytes!!',
      token: draft.token,
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('signature_mismatch');
  });

  it('handles malformed expiry date gracefully', () => {
    const [nonce, , ] = 'aaaaa|bogus-date|ccccc'.split('|');
    const token = `${nonce.repeat(4)}|bogus-date|${'c'.repeat(8)}`; // >= 20 chars
    const result = verifyCsrfTokenDraft({
      sessionId: draftInput.sessionId,
      organizationId: draftInput.organizationId,
      csrfSecret: draftInput.csrfSecret,
      token,
    });
    // The token won't verify, but it should not crash
    expect(result.ok).toBe(false);
  });
});
