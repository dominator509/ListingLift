import { expect, test } from '@playwright/test';

test('admin preset manager shell renders phase 6 preset controls', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/presets');
  await expect(page.getByRole('heading', { name: 'Platform Presets', exact: true })).toBeVisible();
  await expect(page.getByText('Data-driven output presets for marketplace, ecommerce, social-commerce, local listing, and custom delivery folders. Presets control dimensions, format, background, safe margin, naming, compression, folder destination, and review-safe language.')).toBeVisible();

  await expect(page.getByText('Seeded presets')).toBeVisible();
  await expect(page.getByText('Required keys')).toBeVisible();
  await expect(page.getByText('Validation issues')).toBeVisible();
  await expect(page.getByText('Platform groups')).toBeVisible();

  await expect(page.getByRole('columnheader', { name: 'Preset' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Output' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Folder' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Safety' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Preset selector', exact: true })).toBeVisible();
  await expect(page.getByText('Operators choose data-driven output presets before processing. Client-facing final downloads stay hidden until approval.')).toBeVisible();
  await expect(page.getByRole('checkbox').first()).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Custom preset draft', exact: true })).toBeVisible();
  await expect(page.getByText('Create a client-specific preset. Codex must connect this form to the audited API route during runtime integration.')).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="platform"]')).toBeVisible();
  await expect(page.locator('input[name="width"]')).toBeVisible();
  await expect(page.locator('input[name="height"]')).toBeVisible();
  await expect(page.locator('input[name="folderPath"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Draft custom preset' })).toBeVisible();
  await expect(page.getByText('Requires manage:presets and audit logging before persistence.')).toBeVisible();
});
