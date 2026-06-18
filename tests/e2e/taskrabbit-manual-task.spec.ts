import { test, expect } from '@playwright/test';

test.describe.skip('Taskrabbit manual task shell', () => {
  test('admin taskrabbit workflow pages render', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin/taskrabbit');
    await expect(page.getByText('Taskrabbit workflow')).toBeVisible();

    await page.goto('/admin/taskrabbit/task-intake');
    await expect(page.getByText('Taskrabbit task intake')).toBeVisible();
  });
});
