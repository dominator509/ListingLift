import { expect, test } from '@playwright/test';

test.skip('admin job queue shell renders seeded queue sections', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/jobs');
  await expect(page.getByRole('heading', { name: /admin job queue/i })).toBeVisible();
  await expect(page.getByText(/fulfillment queue/i)).toBeVisible();
  await expect(page.getByText(/create manual job/i)).toBeVisible();
});
