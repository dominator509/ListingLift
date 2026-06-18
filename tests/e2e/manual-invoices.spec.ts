import { test, expect } from '@playwright/test';

test.skip('admin manual invoices page renders seed controls', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/billing/manual-invoices');
  await expect(page.getByRole('heading', { name: /Manual invoices/i })).toBeVisible();
  await expect(page.getByText(/Manual payment confirmation/i)).toBeVisible();
});
