import { test, expect } from '@playwright/test';

test.describe.skip('Etsy workflow shell', () => {
  test('admin Etsy workflow pages render', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin/etsy');
    await expect(page.getByText('Etsy workflow')).toBeVisible();

    await page.goto('/admin/etsy/order-intake');
    await expect(page.getByText('Etsy order intake')).toBeVisible();

    await page.goto('/admin/etsy/delivery');
    await expect(page.getByText('Etsy delivery')).toBeVisible();
  });
});
