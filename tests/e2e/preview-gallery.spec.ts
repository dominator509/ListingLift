import { expect, test } from '@playwright/test';

test.describe('preview gallery shell', () => {
  test('admin preview page renders review language', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });
    await page.goto('/admin/previews');
    await expect(page.locator('h1')).toHaveText('Preview gallery');
    await expect(page.getByText('Bulk preview approval')).toBeVisible();
    await expect(page.getByText(/No marketplace approval/i)).toBeVisible();
  });
});
