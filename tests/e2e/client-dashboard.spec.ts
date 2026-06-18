import { test, expect } from '@playwright/test';

test.describe.skip('client dashboard scaffold', () => {
  test('renders client dashboard routes', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/client');
    await expect(page.getByText('Your ListingLift image workspace')).toBeVisible();
  });
});
