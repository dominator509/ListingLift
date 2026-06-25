import { test, expect } from '@playwright/test';

test('admin Gumroad page exposes safety and mapping sections', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/gumroad');
  await expect(page.getByRole('heading', { name: 'Gumroad checkout and webhook intake', exact: true })).toBeVisible();
  await expect(page.getByText('verified webhook signatures')).toBeVisible();
  await expect(page.getByText('dry-run/manual-review mode')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Webhook safety', exact: true })).toBeVisible();
  await expect(page.getByText('GUMROAD_WEBHOOK_SECRET')).toBeVisible();
  await expect(page.getByText('server-side only')).toBeVisible();
  await expect(page.getByText('must not create another job or credits')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Gumroad product mapping', exact: true })).toBeVisible();
  await expect(page.getByText('Upload-link plan')).toBeVisible();
  await expect(page.getByText('Links must be hashed, expiring, and scoped server-side.')).toBeVisible();
  await expect(page.getByText('Never include webhook secrets, raw tokens, or full payment payloads')).toBeVisible();
});
