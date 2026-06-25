import { test, expect } from '@playwright/test';

test.describe('Phase 23 other sales channels admin UI', () => {
  test('renders generic sales channel manual workflow surfaces', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });

    await page.goto('/admin/other-sales-channels');
    await expect(page.getByRole('heading', { name: 'Other sales channels', exact: true })).toBeVisible();
    await expect(page.getByText('Manual-first source tracking')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Other sales channel workflow', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Selectable Phase 23 sources', exact: true })).toBeVisible();
    await expect(page.getByText('Do not scrape private pages').first()).toBeVisible();
    await expect(page.getByText('Do not store marketplace, directory, or social platform passwords').first()).toBeVisible();

    await page.goto('/admin/other-sales-channels/manual-order');
    await expect(page.getByRole('heading', { name: 'Manual source order', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Manual lead/order intake', exact: true })).toBeVisible();
    await expect(page.getByText('tenant-scoped Prisma transactions and audit logs')).toBeVisible();
    await expect(page.getByText('Manual fallback is mandatory')).toBeVisible();

    await page.goto('/admin/other-sales-channels/templates');
    await expect(page.getByRole('heading', { name: 'Proposal and follow-up templates', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Proposal template', exact: true })).toBeVisible();
    await expect(page.getByText('avoids marketplace approval or sales guarantees')).toBeVisible();
    await expect(page.getByText('Marketplace approval, ranking, sales, conversion')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Follow-up status', exact: true })).toBeVisible();

    await page.goto('/admin/other-sales-channels/follow-ups');
    await expect(page.getByRole('heading', { name: 'Generic channel follow-ups', exact: true })).toBeVisible();
    await expect(page.getByText('without automating platform messages')).toBeVisible();
    await expect(page.getByText('RETAINER_CONVERTED')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Revenue attribution', exact: true })).toBeVisible();
  });
});
