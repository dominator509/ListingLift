import { test, expect } from '@playwright/test';

test('Shopify workflow admin shell renders manual and OAuth-scaffold safety surfaces', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/shopify');
  await expect(page.getByRole('heading', { name: 'Shopify Workflow', exact: true })).toBeVisible();
  await expect(page.getByText('Manual-first Shopify product image workflow')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Shopify workflow safety', exact: true })).toBeVisible();
  await expect(page.getByText('Do not scrape private Shopify admin pages').first()).toBeVisible();
  await expect(page.getByText('Do not store Shopify passwords').first()).toBeVisible();

  await page.goto('/admin/shopify/order-intake');
  await expect(page.getByRole('heading', { name: 'Shopify order intake', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Manual Shopify job intake', exact: true })).toBeVisible();
  await expect(page.getByText('server-side validation, duplicate prevention')).toBeVisible();
  await expect(page.getByText('Client, ExternalOrder, Job, UploadToken')).toBeVisible();

  await page.goto('/admin/shopify/oauth');
  await expect(page.getByRole('heading', { name: 'Shopify OAuth scaffold', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Shopify OAuth app scaffold', exact: true })).toBeVisible();
  await expect(page.getByText('Real Shopify API calls must remain feature-flagged')).toBeVisible();
  await expect(page.getByText('encrypted secret references')).toBeVisible();

  await page.goto('/admin/shopify/products');
  await expect(page.getByRole('heading', { name: 'Shopify products and SKUs', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Shopify product/SKU import planner', exact: true })).toBeVisible();
  await expect(page.getByText('CSV/API-scaffold first')).toBeVisible();
  await expect(page.getByText('prohibit private Shopify admin scraping')).toBeVisible();

  await page.goto('/admin/shopify/delivery');
  await expect(page.getByRole('heading', { name: 'Shopify delivery', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Shopify delivery template', exact: true })).toBeVisible();
  await expect(page.getByText('Do not replace product images automatically')).toBeVisible();
  await expect(page.getByText('Shopify approval, product approval, ranking, traffic, sales, conversion')).toBeVisible();

  await page.goto('/admin/shopify/replacements');
  await expect(page.getByRole('heading', { name: 'Shopify replacement approvals', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Product image replacement approval', exact: true })).toBeVisible();
  await expect(page.getByText('PENDING_MERCHANT_REVIEW')).toBeVisible();
  await expect(page.getByText('must block automated/live product image replacement')).toBeVisible();

  await page.goto('/admin/shopify/audit');
  await expect(page.getByRole('heading', { name: 'Shopify product-page audit', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Shopify product-page visual audit', exact: true })).toBeVisible();
  await expect(page.getByText('Storefront image consistency score', { exact: true })).toBeVisible();
  await expect(page.getByText('Merchant review recommended before publishing.')).toBeVisible();
});
