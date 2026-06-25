import { test, expect } from '@playwright/test';

test('admin Upwork workflow pages render manual-safe contract surfaces', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/upwork');
  await expect(page.getByRole('heading', { name: 'Upwork workflow', exact: true })).toBeVisible();
  await expect(page.getByText('Manual-first contract intake')).toBeVisible();
  await expect(page.getByText('Do not scrape private Upwork pages').first()).toBeVisible();
  await expect(page.getByText('Never guarantee marketplace approval').first()).toBeVisible();

  await page.goto('/admin/upwork/contract-intake');
  await expect(page.getByRole('heading', { name: 'Upwork contract intake', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Manual Upwork contract intake', exact: true })).toBeVisible();
  await expect(page.getByText('Contract ID', { exact: true })).toBeVisible();
  await expect(page.getByText('/api/upwork/manual-contract')).toBeVisible();

  await page.goto('/admin/upwork/proposals');
  await expect(page.getByRole('heading', { name: 'Upwork proposal templates', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Proposal template', exact: true })).toBeVisible();
  await expect(page.getByText('platform-ready draft product image files')).toBeVisible();

  await page.goto('/admin/upwork/delivery');
  await expect(page.getByRole('heading', { name: 'Upwork delivery', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Delivery template', exact: true })).toBeVisible();
  await expect(page.getByText('approved Upwork delivery/message flow')).toBeVisible();

  await page.goto('/admin/upwork/revisions');
  await expect(page.getByRole('heading', { name: 'Upwork revisions', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Revision tracking', exact: true })).toBeVisible();
  await expect(page.getByText('READY_FOR_REVIEW')).toBeVisible();

  await page.goto('/admin/upwork/retainers');
  await expect(page.getByRole('heading', { name: 'Upwork retainers', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Retainer upsell reminder', exact: true })).toBeVisible();
  await expect(page.getByText('monthly seller image retainer')).toBeVisible();
});
