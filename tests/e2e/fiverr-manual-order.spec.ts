import { expect, test } from '@playwright/test';

test('admin Fiverr manual workflow pages render compliance-safe surfaces', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/fiverr');
  await expect(page.getByRole('heading', { name: 'Fiverr workflow', exact: true }).first()).toBeVisible();
  await expect(page.getByText('Manual-first Fiverr intake')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Manual Fiverr order intake', exact: true })).toBeVisible();
  await expect(page.getByText(/Do not scrape private Fiverr pages/i)).toBeVisible();
  await expect(page.getByText(/No scraping, password storage, or unauthorized messaging/i)).toBeVisible();

  await page.goto('/admin/fiverr/order-intake');
  await expect(page.getByRole('heading', { name: 'Fiverr order intake', exact: true })).toBeVisible();
  await expect(page.getByText('deduped by Fiverr order ID')).toBeVisible();
  await expect(page.getByText('Fiverr gig mapping')).toBeVisible();
  await expect(page.getByPlaceholder(/Do not paste marketplace passwords/i)).toBeVisible();

  await page.goto('/admin/fiverr/delivery');
  await expect(page.getByRole('heading', { name: 'Fiverr delivery', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fiverr delivery template', exact: true })).toBeVisible();
  await expect(page.getByText('Safe copy for manual Fiverr delivery')).toBeVisible();
  await expect(page.getByText(/Does not guarantee platform approval or results/i)).toBeVisible();

  await page.goto('/admin/fiverr/revisions');
  await expect(page.getByRole('heading', { name: 'Fiverr revisions', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fiverr revision tracking', exact: true })).toBeVisible();
  await expect(page.getByText('READY FOR REVIEW')).toBeVisible();
  await expect(page.getByText('Open Fiverr revisions must block job completion')).toBeVisible();
});
