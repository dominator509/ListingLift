import { expect, test } from '@playwright/test';

test.describe.skip('phase 34 admin dashboard scaffold', () => {
  test('renders admin dashboard and revenue analytics shells', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin');
    await expect(page.getByText('Admin dashboard and revenue analytics')).toBeVisible();
    await page.goto('/admin/revenue');
    await expect(page.getByText('Revenue analytics')).toBeVisible();
    await page.goto('/admin/revenue/source-tracking');
    await expect(page.getByText('Source tracking')).toBeVisible();
    await page.goto('/admin/revenue/conversions');
    await expect(page.getByText('Marketplace-to-direct conversions')).toBeVisible();
    await page.goto('/admin/revenue/retainers');
    await expect(page.getByText('Retainer opportunity alerts')).toBeVisible();
  });
});
