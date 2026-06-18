import { expect, test } from '@playwright/test';

test.skip('admin social-commerce workflow pages render', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/social-commerce');
  await expect(page.getByText('Social commerce workflows')).toBeVisible();

  await page.goto('/admin/social-commerce/order-intake');
  await expect(page.getByText('Social-commerce order intake')).toBeVisible();
});
