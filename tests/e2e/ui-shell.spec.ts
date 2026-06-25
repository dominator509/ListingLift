import { expect, test } from '@playwright/test';

test('public shell exposes core navigation', async ({ page }) => {
  await page.goto('/');
  const publicNavigation = page.getByLabel('Public navigation');
  await expect(publicNavigation.getByRole('link', { name: 'Pricing' })).toBeVisible();
  await expect(publicNavigation.getByRole('link', { name: /^Packages$/ })).toBeVisible();
  await expect(publicNavigation.getByRole('link', { name: 'Agencies' })).toBeVisible();
});

test('admin shell exposes fulfillment navigation', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Admin dashboard and revenue analytics', exact: true })).toBeVisible();
  await expect(page.getByText('A fulfillment command center for active jobs, completed jobs, source attribution, revenue, marketplace-to-direct conversion signals, retainer alerts, and upsell operations.')).toBeVisible();
  await expect(page.getByText('Active jobs', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Due soon', { exact: true })).toBeVisible();
  await expect(page.getByText('Flagged outputs', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Net revenue', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Jobs' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Flagged outputs' })).toBeVisible();
});
