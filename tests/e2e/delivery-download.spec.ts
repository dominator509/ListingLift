import { expect, test } from '@playwright/test';

test('delivery token page shows secure delivery copy', async ({ page }) => {
  await page.goto('/delivery/example-token-for-e2e-only');
  await expect(page.getByText('Secure download page')).toBeVisible();
  await expect(page.getByText('Download is not available yet.')).toBeVisible();
  await expect(page.getByText('Delivery token is stored as a hash only.')).toBeVisible();
  await expect(page.getByText('Job must be approved and ready for delivery.')).toBeVisible();
  await expect(page.getByText('Every access and denial must be audited.')).toBeVisible();
  await expect(page.getByText('platform-ready drafts')).toBeVisible();
});

test('admin delivery send page shows message panels', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });
  await page.goto('/admin/jobs/job_1/delivery/send');
  await expect(page.getByText('Send delivery')).toBeVisible();
  await expect(page.getByText('Delivery link manager')).toBeVisible();
  await expect(page.getByText('Hash only')).toBeVisible();
  await expect(page.getByText('Marketplace delivery message')).toBeVisible();
  await expect(page.getByText('Deliver inside the marketplace when required.')).toBeVisible();
});
