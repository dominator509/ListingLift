import { expect, test } from '@playwright/test';

test.skip('upload token page exposes secure intake language', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/upload/demo-token-1234567890');
  await expect(page.getByRole('heading', { name: /Upload product photos/i })).toBeVisible();
  await expect(page.getByText(/original uploads are preserved/i)).toBeVisible();
  await expect(page.getByText(/Final downloads remain hidden until admin approval/i)).toBeVisible();
});
