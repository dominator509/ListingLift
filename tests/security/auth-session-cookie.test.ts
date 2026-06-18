import { describe, expect, it } from 'vitest';
import { SESSION_COOKIE_NAME, readSessionCookie, serializeSessionClearCookie, serializeSessionCookie } from '../../src/server/auth/session-cookie';

describe('phase 3 session cookie security contract', () => {
  it('serializes session cookies as HTTP-only and SameSite Lax', () => {
    const cookie = serializeSessionCookie('abc123', { secure: true });
    expect(cookie).toContain(`${SESSION_COOKIE_NAME}=abc123`);
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('Path=/');
  });

  it('clears session cookies with max-age 0', () => {
    expect(serializeSessionClearCookie({ secure: true })).toContain('Max-Age=0');
  });

  it('reads the session token from a request cookie header', () => {
    const request = new Request('https://listinglift.test/admin', { headers: { cookie: 'other=1; ll_session=token-123' } });
    expect(readSessionCookie(request)).toBe('token-123');
  });
});
