import { test, expect } from '@playwright/test';

test.skip('admin processing page renders pipeline shell', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/processing');
  await expect(page.getByText('Image processing pipeline')).toBeVisible();
  await expect(page.getByText('Pipeline status')).toBeVisible();
  await expect(page.getByText('Output plan')).toBeVisible();
});
