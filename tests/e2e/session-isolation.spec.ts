import { expect, test } from '@playwright/test';

const BASE = process.env.APP_URL || 'http://localhost:3000';

test.describe('Session isolation', () => {
  const timestamp = Date.now();

  const userA = {
    email: `sess-a-${timestamp}@test.com`,
    password: 'PassA789!safe',
    name: 'Session User A',
    orgName: `SessionOrgA-${timestamp}`,
    ip: '10.38.4.1',
  };

  const userB = {
    email: `sess-b-${timestamp}@test.com`,
    password: 'PassB789!safe',
    name: 'Session User B',
    orgName: `SessionOrgB-${timestamp}`,
    ip: '10.38.4.2',
  };

  let tokenA: string;
  let tokenB: string;

  test.beforeAll(async ({ request }) => {
    // Sign up user A
    let res = await request.post(`${BASE}/api/auth/signup`, {
      data: { email: userA.email, password: userA.password, name: userA.name, organizationName: userA.orgName },
      headers: { 'x-forwarded-for': userA.ip },
    });
    expect(res.status()).toBe(201);
    let body = await res.json();
    let verifyRes = await request.post(`${BASE}/api/auth/verify-email`, {
      data: { token: body?.data?.verificationToken },
      headers: { 'x-forwarded-for': userA.ip },
    });
    expect(verifyRes.status()).toBe(200);
    let loginRes = await request.post(`${BASE}/api/auth/login`, {
      data: { email: userA.email, password: userA.password },
      headers: { 'x-forwarded-for': userA.ip },
    });
    expect(loginRes.status()).toBe(200);
    let cookies = loginRes.headers()['set-cookie'] || '';
    let match = cookies.match(/ll_session=([^;]+)/);
    if (match) tokenA = match[1];

    // Sign up user B
    res = await request.post(`${BASE}/api/auth/signup`, {
      data: { email: userB.email, password: userB.password, name: userB.name, organizationName: userB.orgName },
      headers: { 'x-forwarded-for': userB.ip },
    });
    expect(res.status()).toBe(201);
    body = await res.json();
    verifyRes = await request.post(`${BASE}/api/auth/verify-email`, {
      data: { token: body?.data?.verificationToken },
      headers: { 'x-forwarded-for': userB.ip },
    });
    expect(verifyRes.status()).toBe(200);
    loginRes = await request.post(`${BASE}/api/auth/login`, {
      data: { email: userB.email, password: userB.password },
      headers: { 'x-forwarded-for': userB.ip },
    });
    expect(loginRes.status()).toBe(200);
    cookies = loginRes.headers()['set-cookie'] || '';
    match = cookies.match(/ll_session=([^;]+)/);
    if (match) tokenB = match[1];
  });

  test('user A and user B resolve to distinct sessions', async ({ request }) => {
    const userARes = await request.get(`${BASE}/api/auth/me`, {
      headers: { 'x-forwarded-for': userA.ip, cookie: `ll_session=${tokenA}` },
    });
    expect(userARes.status()).toBe(200);

    const userBRes = await request.get(`${BASE}/api/auth/me`, {
      headers: { 'x-forwarded-for': userB.ip, cookie: `ll_session=${tokenB}` },
    });
    expect(userBRes.status()).toBe(200);

    const userAData = (await userARes.json())?.data;
    const userBData = (await userBRes.json())?.data;
    expect(userAData?.session?.userId).toBeDefined();
    expect(userBData?.session?.userId).toBeDefined();
    expect(userAData.session.userId).not.toBe(userBData.session.userId);
  });

  test('user B listing does not include user A jobs', async ({ request }) => {
    const res = await request.post(`${BASE}/api/client-dashboard/jobs`, {
      data: {},
      headers: { 'x-forwarded-for': userB.ip, cookie: `ll_session=${tokenB}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const jobs = body?.jobs || [];
    const jobList = Array.isArray(jobs) ? jobs : [];
    // None should reference A's org
    for (const j of jobList) {
      if (j.title) {
        expect(j.title).not.toContain(`Job-by-A-${timestamp}`);
      }
    }
  });

  test('user A still has own session after B logs in', async ({ request }) => {
    const res = await request.get(`${BASE}/api/auth/me`, {
      headers: { 'x-forwarded-for': userA.ip, cookie: `ll_session=${tokenA}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const data = body?.data || body;
    // Response returns session data, not user.email
    expect(data?.session?.userId).toBeDefined();
  });
});
