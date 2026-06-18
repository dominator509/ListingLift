import { expect, test } from '@playwright/test';

test('public shell exposes core navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Packages$/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Agencies' })).toBeVisible();
});

test.skip('admin shell exposes fulfillment navigation', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'admin',
  });
  await page.goto('/admin');
  await expect(page.getByText('Fulfillment command center')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Jobs' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Flagged outputs' })).toBeVisible();
});
