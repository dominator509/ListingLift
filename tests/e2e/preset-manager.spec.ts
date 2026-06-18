import { expect, test } from '@playwright/test';

test.skip('admin preset manager shell renders phase 6 preset controls', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/presets');
  await expect(page.getByRole('heading', { name: /Platform Presets/i })).toBeVisible();
  await expect(page.getByText(/Data-driven output presets/i)).toBeVisible();
  await expect(page.getByText(/Preset selector/i)).toBeVisible();
  await expect(page.getByText(/Custom preset draft/i)).toBeVisible();
});
