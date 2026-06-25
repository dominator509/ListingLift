import { expect, test } from '@playwright/test';

test.describe('phase 35 agency white-label scaffold', () => {
  test('renders agency dashboard, workspace, queue, branding, delivery, report, billing, and team shells', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });
    await page.goto('/agency');
    await expect(page.locator('h1')).toHaveText('Agency white-label dashboard');

    await page.goto('/agency/workspaces');
    await expect(page.locator('h1')).toHaveText('Client workspaces');

    await page.goto('/agency/queue');
    await expect(page.locator('h1')).toHaveText('Bulk processing queue');

    await page.goto('/agency/white-label-settings');
    await expect(page.locator('h1')).toHaveText('Brand kit, delivery, and report previews');

    await page.goto('/agency/delivery');
    await expect(page.locator('h1')).toHaveText('Agency delivery page preview');

    await page.goto('/agency/reports');
    await expect(page.locator('h1')).toHaveText('White-label report drafts');

    await page.goto('/agency/billing');
    await expect(page.locator('h1')).toHaveText('Subscriptions and volume pricing');

    await page.goto('/agency/volume-pricing');
    await expect(page.locator('h1')).toHaveText('Agency volume pricing scaffold');

    await page.goto('/agency/team');
    await expect(page.locator('h1')).toHaveText('Team members and workspace access');
  });
});
