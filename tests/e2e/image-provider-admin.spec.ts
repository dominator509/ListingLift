import { test, expect } from '@playwright/test';

test.skip('admin image provider setup page renders core safety copy', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/integrations/image-providers');
  await expect(page.getByRole('heading', { name: /image provider setup/i })).toBeVisible();
  await expect(page.getByText(/Mock provider must work without paid keys/i)).toBeVisible();
  await expect(page.getByText(/never display secret values/i)).toBeVisible();
});
