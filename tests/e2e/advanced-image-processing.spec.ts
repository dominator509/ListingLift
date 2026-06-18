import { test, expect } from '@playwright/test';

test.describe.skip('advanced image processing admin shell', () => {
  test('renders advanced processing shell', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin/advanced-processing');
    await expect(page.getByText('Advanced Image Processing')).toBeVisible();
    await expect(page.getByText('Admin approval required').first()).toBeVisible();
  });
});
