import { test, expect } from '@playwright/test';

test('admin image provider setup page renders core safety contracts', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/integrations/image-providers');

  await expect(page.getByRole('heading', { name: 'Image provider setup', exact: true })).toBeVisible();
  await expect(page.getByText('without exposing secrets or requiring paid APIs')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Provider readiness contract', exact: true })).toBeVisible();
  await expect(page.getByText('Mock provider must be healthy by default')).toBeVisible();
  await expect(page.getByText('Mock Image Provider').first()).toBeVisible();
  await expect(page.getByText('ready').first()).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Setup sequence', exact: true })).toBeVisible();
  await expect(page.getByText('MOCK_IMAGE_PROVIDER_ENABLED=true')).toBeVisible();
  await expect(page.getByText('REAL_IMAGE_PROVIDER_CALLS_ENABLED=true')).toBeVisible();
  await expect(page.getByText('only after adapter-contract and security tests pass')).toBeVisible();
  await expect(page.getByText('Configurable providers: Mock Image Provider, Remove.bg, Cloudinary')).toBeVisible();

  await expect(page.getByText('REMOVE_BG_ENABLED')).toBeVisible();
  await expect(page.getByText('CLOUDINARY_ENABLED')).toBeVisible();
  await expect(page.getByText('Manual fallback required').first()).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Secret handling', exact: true })).toBeVisible();
  await expect(page.getByText('The UI must never display secret values.')).toBeVisible();
  await expect(page.getByText('REMOVE_BG_API_KEY')).toHaveCount(2);
  await expect(page.getByText('CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET')).toHaveCount(2);
  await expect(page.getByText('No secret required.').first()).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Dry-run test contract', exact: true })).toBeVisible();
  await expect(page.getByText('Non-mock providers must remain dry-run only')).toBeVisible();
  await expect(page.getByText('Real provider calls must never be required for baseline tests.')).toBeVisible();
});
