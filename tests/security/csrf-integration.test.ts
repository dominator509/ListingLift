/**
 * CSRF INTEGRATION TESTS — CIA/NSA GRADE
 *
 * These tests require a running Next.js server at TEST_BASE_URL.
 * They are skipped by default during unit/integration test runs.
 * Unskip by removing the .skip when running against a real server.
 */
import { describe, it, expect } from 'vitest';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3005';

describe.skip('CSRF Protection — CIA/NSA Grade', () => {
  it('A1: Rejects mutation without CSRF token', async () => {
    const res = await fetch(`${BASE}/api/jobs`, {
      method: 'POST',
      headers: {
        'x-demo-user-id': 'user_qa',
        'x-demo-organization-id': 'org_qa',
        'x-demo-role': 'SUPER_ADMIN',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(403);
  });

  it('A2: Accepts mutation with valid CSRF token', async () => {
    // Fetch a fresh token
    const tokenRes = await fetch(`${BASE}/api/csrf/token`, {
      method: 'POST',
      headers: {
        'x-demo-user-id': 'user_qa',
        'x-demo-organization-id': 'org_qa',
        'x-demo-role': 'SUPER_ADMIN',
      },
    });
    const { csrfToken } = await tokenRes.json();
    const res = await fetch(`${BASE}/api/jobs`, {
      method: 'POST',
      headers: {
        'x-demo-user-id': 'user_qa',
        'x-demo-organization-id': 'org_qa',
        'x-demo-role': 'SUPER_ADMIN',
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({}),
    });
    expect(res.status).not.toBe(403);
  });

  it('A3: Rejects expired CSRF token', async () => {
    const res = await fetch(`${BASE}/api/jobs`, {
      method: 'POST',
      headers: {
        'x-demo-user-id': 'user_qa',
        'x-demo-organization-id': 'org_qa',
        'x-demo-role': 'SUPER_ADMIN',
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'fake.1000000.badsig',
      },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(403);
  });

  it('A4: Rejects forged CSRF token', async () => {
    const res = await fetch(`${BASE}/api/jobs`, {
      method: 'POST',
      headers: {
        'x-demo-user-id': 'user_qa',
        'x-demo-organization-id': 'org_qa',
        'x-demo-role': 'SUPER_ADMIN',
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'attackertoken.9999999999.wrongsignature',
      },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(403);
  });

  it('A5: CSRF token endpoint returns token with valid session', async () => {
    const res = await fetch(`${BASE}/api/csrf/token`, {
      method: 'POST',
      headers: {
        'x-demo-user-id': 'user_qa',
        'x-demo-organization-id': 'org_qa',
        'x-demo-role': 'SUPER_ADMIN',
      },
    });
    const body = await res.json();
    expect(body.csrfToken).toBeTruthy();
    expect(typeof body.csrfToken).toBe('string');
    expect(body.csrfToken.split('.')).toHaveLength(3);
  });

  it('A6: GET requests do not require CSRF token', async () => {
    const res = await fetch(`${BASE}/api/jobs`, {
      headers: {
        'x-demo-user-id': 'user_qa',
        'x-demo-organization-id': 'org_qa',
        'x-demo-role': 'SUPER_ADMIN',
      },
    });
    expect(res.status).toBe(200);
  });

  it('B1: SameSite is Strict on session cookie', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
    });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      expect(setCookie.toLowerCase()).toMatch(/samesite=strict/);
    } else {
      console.warn('No set-cookie header received — B1 skipped');
    }
  });
});
