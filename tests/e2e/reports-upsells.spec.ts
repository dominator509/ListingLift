import { expect, test } from '@playwright/test';

test('reports and upsells admin shells render', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/reports');
  await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
  await expect(page.getByText('Build client, admin, agency, and white-label report drafts from approved fulfillment data.')).toBeVisible();
  await expect(page.getByText('Draft reports')).toBeVisible();
  await expect(page.getByText('Ready for approval')).toBeVisible();
  await expect(page.getByText('Client-visible')).toBeVisible();
  await expect(page.getByText('White-label drafts')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Report and upsell safety', exact: true })).toBeVisible();
  await expect(page.getByText('Reports and upsells must never guarantee marketplace approval, ranking, sales, conversion, product approval, listing approval, or ad performance.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Report builder', exact: true })).toBeVisible();
  await expect(page.getByText('Build delivery summaries, image quality reports, monthly cleanup reports, and white-label reports from approved job data.')).toBeVisible();

  await page.goto('/admin/upsells');
  await expect(page.getByRole('heading', { name: 'Upsell Engine', exact: true })).toBeVisible();
  await expect(page.getByText('Detect post-delivery opportunities and prepare manual-review offer drafts.')).toBeVisible();
  await expect(page.getByText('Monthly retainer')).toBeVisible();
  await expect(page.getByText('Ad creative pack')).toBeVisible();
  await expect(page.getByText('Shopify product-page improvement')).toBeVisible();
  await expect(page.getByText('Manual review required before sending.').first()).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Offer' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'CTA' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Safe claim' })).toBeVisible();
});
