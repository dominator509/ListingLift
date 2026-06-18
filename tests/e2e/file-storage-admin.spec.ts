import { test, expect } from '@playwright/test';

test.describe.skip('file storage admin shell', () => {
  test('renders file storage admin pages', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin/file-storage');
    await expect(page.getByRole('heading', { name: /File storage integrations/i })).toBeVisible();
  });
});
