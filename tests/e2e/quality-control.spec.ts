import { expect, test } from '@playwright/test';

test.describe.skip('Phase 14 quality control shell', () => {
  test('admin QC page renders internal safe language', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin/quality-control');
    await expect(page.getByText('Quality control')).toBeVisible();
    await expect(page.getByText(/final delivery gated/i)).toBeVisible();
  });

  test('flagged outputs page renders manual fallback panel', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin/flagged-outputs');
    await expect(page.getByText('Flagged outputs')).toBeVisible();
    await expect(page.getByText(/Manual replacement fallback/i)).toBeVisible();
  });
});
