import { expect, test } from '@playwright/test';

test.describe.skip('Fiverr manual workflow shell', () => {
  test('admin Fiverr page renders workflow and safety panels', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin/fiverr');
    await expect(page.getByRole('heading', { name: /Fiverr workflow/i })).toBeVisible();
    await expect(page.getByText(/Do not scrape private Fiverr pages/i)).toBeVisible();
    await expect(page.getByText(/Manual Fiverr order intake/i)).toBeVisible();
  });
});
