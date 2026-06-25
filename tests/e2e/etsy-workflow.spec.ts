import { test, expect } from '@playwright/test';

test('admin Etsy workflow pages render marketplace-safe manual surfaces', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/etsy');
  await expect(page.getByRole('heading', { name: 'Etsy workflow', exact: true })).toBeVisible();
  await expect(page.getByText('Manual-first Etsy order intake')).toBeVisible();
  await expect(page.getByText('Seller review is always required.')).toBeVisible();
  await expect(page.getByText('Do not scrape private Etsy order pages').first()).toBeVisible();
  await expect(page.getByText('Do not guarantee Etsy listing approval').first()).toBeVisible();

  await page.goto('/admin/etsy/order-intake');
  await expect(page.getByRole('heading', { name: 'Etsy order intake', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Manual Etsy order intake', exact: true })).toBeVisible();
  await expect(page.getByText('server-side validation, duplicate prevention')).toBeVisible();
  await expect(page.getByText('Client, ExternalOrder, Job, UploadToken')).toBeVisible();
  await expect(page.getByText('Etsy safety checklist')).toBeVisible();

  await page.goto('/admin/etsy/delivery');
  await expect(page.getByRole('heading', { name: 'Etsy delivery', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Etsy delivery template', exact: true })).toBeVisible();
  await expect(page.getByText('Do not automate buyer messages')).toBeVisible();
  await expect(page.getByText('Etsy approval, ranking, traffic, sales, conversion')).toBeVisible();

  await page.goto('/admin/etsy/listings');
  await expect(page.getByRole('heading', { name: 'Etsy listings', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Etsy listing import planner', exact: true })).toBeVisible();
  await expect(page.getByText('manual/API-scaffold only')).toBeVisible();
  await expect(page.getByText('prohibit private Etsy scraping')).toBeVisible();

  await page.goto('/admin/etsy/reports');
  await expect(page.getByRole('heading', { name: 'Etsy reports', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Etsy shop visual report', exact: true })).toBeVisible();
  await expect(page.getByText('Seller-review warnings')).toBeVisible();
  await expect(page.getByText('Review crop consistency before publishing.')).toBeVisible();
});
