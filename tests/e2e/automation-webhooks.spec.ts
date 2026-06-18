import { expect, test } from '@playwright/test';

test.describe.skip('automation webhooks admin shell', () => {
  test('renders automation webhook admin pages', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin/automation-webhooks');
    await expect(page.getByText('Automation webhooks')).toBeVisible();

    await page.goto('/admin/automation-webhooks/subscriptions');
    await expect(page.getByText('Automation subscriptions')).toBeVisible();

    await page.goto('/admin/automation-webhooks/dead-letter');
    await expect(page.getByText('Automation dead-letter queue')).toBeVisible();
  });
});
