import { expect, test } from '@playwright/test';

test.describe('Phase 38 full testing QA admin shell', () => {
  test('renders the full testing QA page shell', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'user_qa',
      'x-demo-organization-id': 'org_qa',
      'x-demo-role': 'SUPER_ADMIN',
    });
    await page.goto('/admin/qa');
    await expect(page.getByRole('heading', { name: 'Full testing and QA' })).toBeVisible();
    await expect(page.getByText('Required QA command sequence')).toBeVisible();
    await expect(page.getByText('No fake QA results')).toBeVisible();
  });
});
