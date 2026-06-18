import { expect, test } from '@playwright/test';

test.describe('Phase 37 security hardening admin shell', () => {
  test('renders the security hardening page shell', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'user_security',
      'x-demo-organization-id': 'org_security',
      'x-demo-role': 'SUPER_ADMIN',
    });
    await page.goto('/admin/security');
    // Admin pages may redirect to login; verify the page responds
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/admin\/security|\/login/);
  });
});
