import { test, expect } from '@playwright/test';

test.skip('admin Gumroad page exposes safety and mapping sections', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/gumroad');
  await expect(page.getByText('Gumroad checkout and webhook intake')).toBeVisible();
  await expect(page.getByText('Webhook safety')).toBeVisible();
  await expect(page.getByText('Gumroad product mapping')).toBeVisible();
});
