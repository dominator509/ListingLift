import { test, expect } from '@playwright/test';

test.describe.skip('Phase 23 other sales channels admin UI', () => {
  test('renders generic sales channel dashboard shell', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin/other-sales-channels');
    await expect(page.getByText('Other sales channels')).toBeVisible();
    await expect(page.getByText('Selectable Phase 23 sources')).toBeVisible();
  });
});
