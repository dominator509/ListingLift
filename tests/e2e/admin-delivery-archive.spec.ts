import { test, expect } from '@playwright/test';

test.skip('admin delivery archive page renders phase 12 shell', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/jobs/job_demo_001/delivery');
  await expect(page.getByText('Delivery archive planning')).toBeVisible();
  await expect(page.getByText('ZIP archive summary')).toBeVisible();
});
