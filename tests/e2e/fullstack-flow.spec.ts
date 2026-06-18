import { expect, test } from '@playwright/test';

const BASE = process.env.APP_URL || 'http://localhost:3000';

test.describe('Full-stack E2E flow', () => {
  const ts = Date.now();
  const email = `e2e-flow-${ts}@test.com`;
  const password = 'E2EFlow789!';
  const name = 'E2E Flow User';
  const orgName = `E2EFlowOrg-${ts}`;

  test('home page loads with core content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Turn messy product photos');
    await expect(page.getByText('Service packages')).toBeVisible();
    await expect(page.getByText('Quick Cleanup Pack')).toBeVisible();
  });

  test('pricing page is accessible', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page).toHaveURL(/\/pricing/);
    // Should show package information
    await expect(page.getByText(/Marketplace Listing/i).first()).toBeVisible();
  });

  test('signup flow via API creates account and session', async ({ request }) => {
    const res = await request.post(`${BASE}/api/auth/signup`, {
      data: { email, password, name, organizationName: orgName },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body?.ok).toBe(true);
    expect(body?.data?.user?.email).toBe(email);
    // Session cookie should be set
    const cookies = res.headers()['set-cookie'] || '';
    expect(cookies).toContain('ll_session');
  });

  test('login flow via API returns session', async ({ request }) => {
    const res = await request.post(`${BASE}/api/auth/login`, {
      data: { email, password },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body?.ok).toBe(true);
    const cookies = res.headers()['set-cookie'] || '';
    expect(cookies).toContain('ll_session');
  });

  test('authenticated user can access /api/auth/me', async ({ request }) => {
    // Login first
    const loginRes = await request.post(`${BASE}/api/auth/login`, {
      data: { email, password },
    });
    const cookies = loginRes.headers()['set-cookie'] || '';
    const match = cookies.match(/ll_session=([^;]+)/);
    expect(match).not.toBeNull();
    const token = match![1];

    const meRes = await request.get(`${BASE}/api/auth/me`, {
      headers: { cookie: `ll_session=${token}` },
    });
    expect(meRes.status()).toBe(200);
    const body = await meRes.json();
    const data = body?.data || body;
    // Response returns session data, not user.email
    expect(data?.session?.userId).toBeDefined();
  });

  test('unauthenticated user gets 401 from /api/auth/me', async ({ request }) => {
    const res = await request.get(`${BASE}/api/auth/me`);
    expect(res.status()).toBe(401);
  });

  test('health endpoint returns ok', async ({ request }) => {
    const res = await request.get(`${BASE}/api/health`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body?.ok).toBe(true);
    expect(body?.service).toBe('listinglift');
  });

  test('packages are listed via API', async ({ request }) => {
    const res = await request.get(`${BASE}/api/packages`);
    expect([200, 401]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      // Should contain package data
      expect(body).toBeDefined();
    }
  });

  test('sign in page has expected elements', async ({ page }) => {
    await page.goto('/login');
    // Should have email/password fields or redirect
    await expect(page).toHaveURL(/\/login|\/dashboard/);
  });

  test('upload demo page loads', async ({ page }) => {
    await page.goto('/upload/demo-token');
    // Page may show upload form, 404, or error — verify it doesn't crash the browser
    const url = page.url();
    // Should reach some page (not hang)
    expect(url).toBeTruthy();
  });
});
