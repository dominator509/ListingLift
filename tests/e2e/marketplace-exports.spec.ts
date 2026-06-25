import { test, expect } from '@playwright/test';

test.describe('marketplace export admin shell', () => {
  test('renders Amazon/eBay/WooCommerce workflow pages', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });

    await page.goto('/admin/marketplace-exports');
    await expect(page.getByRole('heading', { name: 'Amazon, eBay, WooCommerce workflows', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Marketplace safety and compliance language', exact: true })).toBeVisible();
    await expect(page.getByText('Seller review required before publishing.').first()).toBeVisible();

    await page.goto('/admin/marketplace-exports/export-plan');
    await expect(page.getByRole('heading', { name: 'Export plan templates', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Channel' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Folders' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Roles' })).toBeVisible();

    await page.goto('/admin/marketplace-exports/manual-order');
    await expect(page.getByRole('heading', { name: 'Manual marketplace order intake', exact: true })).toBeVisible();
    await expect(page.getByText('Capture Amazon seller export, eBay order/export, or WooCommerce product-gallery work without scraping or storing marketplace passwords.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create dry-run plan' })).toBeVisible();

    await page.goto('/admin/marketplace-exports/delivery');
    await expect(page.getByRole('heading', { name: 'Delivery copy templates', exact: true })).toBeVisible();
    await expect(page.getByText('Delivery messages must be generated only after archive approval and must use seller-review-required, non-guarantee language.')).toBeVisible();

    await page.goto('/admin/marketplace-exports/safety');
    await expect(page.getByRole('heading', { name: 'Blocked actions', exact: true })).toBeVisible();
    await expect(page.getByText('Private page scraping')).toBeVisible();
    await expect(page.getByText('Password storage')).toBeVisible();
    await expect(page.getByText('Auto-publishing')).toBeVisible();
  });
});
