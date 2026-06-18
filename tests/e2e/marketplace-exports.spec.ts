import { test, expect } from '@playwright/test';

test.describe.skip('marketplace export admin shell', () => {
  test('renders Amazon/eBay/WooCommerce workflow pages', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin/marketplace-exports');
    await expect(page.getByText('Amazon, eBay, WooCommerce workflows')).toBeVisible();
    await expect(page.getByText('seller/operator review')).toBeVisible();
  });
});
