import { test, expect } from '@playwright/test';

test.skip('Shopify workflow admin shell renders', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/shopify');
  await expect(page.getByText('Shopify Workflow')).toBeVisible();
});
