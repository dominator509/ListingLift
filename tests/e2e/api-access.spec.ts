import { expect, test } from '@playwright/test';

test.describe.skip('phase 36 API access scaffold', () => {
  test('renders API access, tokens, scopes, webhooks, shared portal, and integrations shells', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });
    await page.goto('/admin/api-access');
    await expect(page.getByText('API access and advanced integrations')).toBeVisible();

    await page.goto('/admin/api-access/tokens');
    await expect(page.getByText('API token management')).toBeVisible();

    await page.goto('/admin/api-access/scopes');
    await expect(page.getByText('API scope matrix')).toBeVisible();

    await page.goto('/admin/api-access/webhooks');
    await expect(page.getByText('API webhook subscriptions')).toBeVisible();

    await page.goto('/admin/api-access/shared-upload-portal');
    await expect(page.getByText('Shared upload portal scaffold')).toBeVisible();

    await page.goto('/admin/api-access/integrations');
    await expect(page.getByText('Advanced integration catalog')).toBeVisible();
  });
});
