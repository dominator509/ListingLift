import { test, expect } from '@playwright/test';

test('admin Stripe billing shell renders', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/billing/stripe');
  await expect(page.getByText('Stripe billing control room')).toBeVisible();
});
