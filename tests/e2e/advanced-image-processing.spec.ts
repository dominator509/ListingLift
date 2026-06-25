import { expect, test } from '@playwright/test';

test.describe('advanced image processing admin shell', () => {
  test('renders advanced processing shell', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });
    await page.goto('/admin/advanced-processing');
    await expect(page.getByText('Advanced Image Processing')).toBeVisible();
    await expect(page.getByText('Admin approval required').first()).toBeVisible();
  });
});
