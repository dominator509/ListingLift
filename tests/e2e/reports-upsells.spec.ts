import { expect, test } from '@playwright/test';

test.skip('reports and upsells admin shells render', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/reports');
  await expect(page.getByText('Reports')).toBeVisible();

  await page.goto('/admin/upsells');
  await expect(page.getByText('Upsell Engine')).toBeVisible();
});
