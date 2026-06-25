import { test, expect } from '@playwright/test';

test('admin manual invoices page renders seed controls', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/billing/manual-invoices');
  await expect(page.getByRole('heading', { name: 'Manual invoices', exact: true }).first()).toBeVisible();
  await expect(page.getByText('Create invoices, confirm external payments, apply credits, and preserve manual fallback without bypassing billing audit controls.')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Create manual invoice', exact: true })).toBeVisible();
  await expect(page.getByText('Manual invoices are fulfillment-safe only after server-side payment confirmation and audit logging.')).toBeVisible();
  await expect(page.getByLabel('Client ID')).toBeVisible();
  await expect(page.getByLabel('Invoice number')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create invoice draft' })).toBeVisible();
  await expect(page.getByText('Codex must wire this to /api/manual-invoices with manage:billing permission.')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Manual payment confirmation', exact: true })).toBeVisible();
  await expect(page.getByText('Confirm external/manual payments only after evidence review.')).toBeVisible();
  await expect(page.getByLabel('Payment reference')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm payment draft' })).toBeVisible();
  await expect(page.getByText('CreditLedger, and AuditLog transactionally')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Billing and license gate', exact: true })).toBeVisible();
  await expect(page.getByText('failed or unverified payments must not unlock delivery, uploads, credits, or dashboards')).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'Verified payment' })).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'Audited manual invoice confirmation' })).toBeVisible();
});
