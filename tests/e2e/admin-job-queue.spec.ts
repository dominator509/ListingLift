import { expect, test } from '@playwright/test';

test('admin job queue shell renders seeded queue sections', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });
  await page.goto('/admin/jobs');
  await expect(page.locator('h1')).toHaveText('Admin job queue');
  await expect(page.getByRole('heading', { name: 'Fulfillment queue' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Create manual job' })).toBeVisible();
});
