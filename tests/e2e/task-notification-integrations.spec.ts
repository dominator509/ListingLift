import { expect, test } from '@playwright/test';

test.skip('Phase 30 task notification pages render', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
  await page.goto('/admin/task-notification-integrations');
  await expect(page.getByText('Task & notification integrations')).toBeVisible();
});
