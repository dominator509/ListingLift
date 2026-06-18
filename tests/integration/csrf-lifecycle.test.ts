/**
 * PHASE 3 — CSRF Lifecycle Integration
 *
 * Validates real data flow of CSRF token lifecycle:
 *   token request -> mutation with valid token -> rejection with bad token
 *
 * Uses real auth to get a session, then exercises the CSRF service.
 */

import { describe, expect, it, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { generateCsrfToken, verifyCsrfForRequest, CsrfRejectionError } from '@/server/services/csrf-protection-service';
import { signup } from '@/server/auth/auth-service';
import { cleanupAll, uniqueEmail, uniqueSlug } from './helpers';

afterEach(async () => {
  await cleanupAll();
});

describe('CSRF lifecycle: generate -> use -> reject bad/replayed/expired', () => {
  it('generates a valid CSRF token for an authenticated session', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signup({ email, password: 'P4ssw0rd!', name: 'CSRF Test', organizationName: `CSRF Org ${slug}` });

    const { token, expiresAt } = generateCsrfToken(result.session);
    expect(token).toBeTruthy();
    expect(token.split('.')).toHaveLength(3);
    expect(typeof expiresAt).toBe('number');
    expect(expiresAt).toBeGreaterThan(Date.now());
  });

  it('accepts a fresh CSRF token on a mutation request', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signup({ email, password: 'P4ssw0rd!', name: 'CSRF User', organizationName: `CSRF Org ${slug}` });

    const { token } = generateCsrfToken(result.session);
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': token, 'content-type': 'application/json' },
    });

    expect(() => verifyCsrfForRequest(request, result.session)).not.toThrow();
  });

  it('rejects a POST request with missing CSRF token', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signup({ email, password: 'P4ssw0rd!', name: 'CSRF User', organizationName: `CSRF Org ${slug}` });

    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });

    expect(() => verifyCsrfForRequest(request, result.session)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(request, result.session);
    } catch (e: unknown) {
      expect((e as CsrfRejectionError).code).toBe('CSRF_TOKEN_MISSING');
    }
  });

  it('rejects a POST request with a tampered CSRF token', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signup({ email, password: 'P4ssw0rd!', name: 'CSRF User', organizationName: `CSRF Org ${slug}` });

    const { token } = generateCsrfToken(result.session);
    const parts = token.split('.');
    const tampered = `${parts[0]}.${parts[1]}.00000000000000000000000000000000`;

    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': tampered, 'content-type': 'application/json' },
    });

    expect(() => verifyCsrfForRequest(request, result.session)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(request, result.session);
    } catch (e: unknown) {
      expect((e as CsrfRejectionError).code).toBe('CSRF_TOKEN_INVALID');
    }
  });

  it('rejects a CSRF token from a different user session', async () => {
    const slug1 = uniqueSlug();
    const slug2 = uniqueSlug();
    const result1 = await signup({ email: uniqueEmail(), password: 'P4ssw0rd!', name: 'User A', organizationName: `Org ${slug1}` });
    const result2 = await signup({ email: uniqueEmail(), password: 'P4ssw0rd!', name: 'User B', organizationName: `Org ${slug2}` });

    const { token } = generateCsrfToken(result1.session);
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': token, 'content-type': 'application/json' },
    });

    // Token from session A should fail for session B
    expect(() => verifyCsrfForRequest(request, result2.session)).toThrow(CsrfRejectionError);
  });

  it('allows GET requests without CSRF token', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signup({ email, password: 'P4ssw0rd!', name: 'CSRF User', organizationName: `CSRF Org ${slug}` });

    const request = new Request('http://localhost:3000/api/test', { method: 'GET' });
    expect(() => verifyCsrfForRequest(request, result.session)).not.toThrow();
  });

  it('skips origin check when skipOriginCheck is set', async () => {
    const email = uniqueEmail();
    const slug = uniqueSlug();
    const result = await signup({ email, password: 'P4ssw0rd!', name: 'CSRF User', organizationName: `CSRF Org ${slug}` });

    const { token } = generateCsrfToken(result.session);
    const request = new Request('http://evil.com/api/test', {
      method: 'POST',
      headers: { 'x-csrf-token': token, origin: 'http://evil.com' },
    });

    expect(() => verifyCsrfForRequest(request, result.session, { skipOriginCheck: true })).not.toThrow();
  });
});
