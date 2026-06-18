import { test, expect } from '@playwright/test';

test.skip('admin Upwork workflow pages render', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/upwork');
  await expect(page.getByText('Upwork workflow')).toBeVisible();

  await page.goto('/admin/upwork/contract-intake');
  await expect(page.getByText('Upwork contract intake')).toBeVisible();
});
