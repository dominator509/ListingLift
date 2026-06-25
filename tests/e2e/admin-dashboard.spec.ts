import { expect, test } from '@playwright/test';

test.describe('phase 34 admin dashboard scaffold', () => {
  test('renders admin dashboard and revenue analytics shells', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });

    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Admin dashboard and revenue analytics', exact: true })).toBeVisible();
    await expect(page.getByText('A fulfillment command center for active jobs, completed jobs, source attribution, revenue, marketplace-to-direct conversion signals, retainer alerts, and upsell operations.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Revenue by sales channel', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Marketplace-to-direct conversion signals', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Retainer opportunity alerts', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Admin analytics guardrails', exact: true })).toBeVisible();

    await page.goto('/admin/revenue');
    await expect(page.getByRole('heading', { name: 'Revenue analytics', exact: true })).toBeVisible();
    await expect(page.getByText('Revenue, source attribution, conversion signals, and retainer opportunities for ListingLift fulfillment operations.')).toBeVisible();
    await expect(page.getByText('Gross revenue', { exact: true })).toBeVisible();
    await expect(page.getByText('Direct conversions', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Revenue by sales channel', exact: true })).toBeVisible();

    await page.goto('/admin/revenue/source-tracking');
    await expect(page.getByRole('heading', { name: 'Source tracking', exact: true })).toBeVisible();
    await expect(page.getByText('Track jobs, revenue, completed jobs, conversion candidates, and retainer alerts by normalized sales channel.')).toBeVisible();
    await expect(page.getByText('Tracked channels', { exact: true })).toBeVisible();
    await expect(page.getByText('Completed jobs', { exact: true }).first()).toBeVisible();

    await page.goto('/admin/revenue/conversions');
    await expect(page.getByRole('heading', { name: 'Marketplace-to-direct conversions', exact: true })).toBeVisible();
    await expect(page.getByText('Internal signals for clients who moved from marketplace/manual sources into direct ListingLift channels.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Marketplace-to-direct conversion signals', exact: true })).toBeVisible();

    await page.goto('/admin/revenue/retainers');
    await expect(page.getByRole('heading', { name: 'Retainer opportunity alerts', exact: true }).first()).toBeVisible();
    await expect(page.getByText('Manual-review alerts for clients who may benefit from monthly image retainers, refresh packs, or dashboard upgrades.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Retainer opportunity alerts', exact: true }).nth(1)).toBeVisible();
  });
});
