import { expect, test } from '@playwright/test';

test.describe('Phase 14 quality control shell', () => {
  test('admin QC page renders internal safe language', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });
    await page.goto('/admin/quality-control');
    await expect(page.getByRole('heading', { name: 'Quality control' })).toBeVisible();
    await expect(page.getByText(/final delivery gated/i)).toBeVisible();
  });

  test('flagged outputs page renders manual fallback panel', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });
    await page.goto('/admin/flagged-outputs');
    await expect(page.locator('h1')).toHaveText('Flagged outputs');
    await expect(page.getByText(/Manual replacement fallback/i)).toBeVisible();
  });
});
