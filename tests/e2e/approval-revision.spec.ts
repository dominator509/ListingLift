import { expect, test } from '@playwright/test';

test.describe('approval and revision shell', () => {
  test('admin approval page renders approval guardrails', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });
    await page.goto('/admin/approvals');
    await expect(page.getByText('Manual approvals')).toBeVisible();
    await expect(page.getByText('Delivery remains a separate gate')).toBeVisible();
  });
});
