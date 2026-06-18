import { expect, test } from '@playwright/test';

test.describe.skip('phase 35 agency white-label scaffold', () => {
  test('renders agency dashboard, workspace, queue, branding, delivery, report, billing, and team shells', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/agency');
    await expect(page.getByText('Agency white-label dashboard')).toBeVisible();

    await page.goto('/agency/workspaces');
    await expect(page.getByText('Client workspaces')).toBeVisible();

    await page.goto('/agency/queue');
    await expect(page.getByText('Bulk processing queue')).toBeVisible();

    await page.goto('/agency/white-label-settings');
    await expect(page.getByText('Brand kit, delivery, and report previews')).toBeVisible();

    await page.goto('/agency/delivery');
    await expect(page.getByText('Agency delivery page preview')).toBeVisible();

    await page.goto('/agency/reports');
    await expect(page.getByText('White-label report drafts')).toBeVisible();

    await page.goto('/agency/billing');
    await expect(page.getByText('Subscriptions and volume pricing')).toBeVisible();

    await page.goto('/agency/volume-pricing');
    await expect(page.getByText('Agency volume pricing scaffold')).toBeVisible();

    await page.goto('/agency/team');
    await expect(page.getByText('Team members and workspace access')).toBeVisible();
  });
});
