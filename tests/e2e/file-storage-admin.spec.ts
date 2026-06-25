import { test, expect } from '@playwright/test';

test.describe('file storage admin shell', () => {
  test('renders file storage admin integration shell and nested route shells', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });

    await page.goto('/admin/file-storage');
    await expect(page.getByRole('heading', { name: 'File storage integrations', exact: true })).toBeVisible();
    await expect(page.getByText('Configure local, mock, Google Drive, and Dropbox storage scaffolds')).toBeVisible();
    await expect(page.getByText('Real integrations stay disabled by default and require encrypted secret references.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Local Replit-compatible storage', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mock file storage', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Google Drive', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dropbox', exact: true })).toBeVisible();
    await expect(page.getByText('No provider secrets required.').first()).toBeVisible();
    await expect(page.getByText('Requires encrypted secret references: GOOGLE_DRIVE_CLIENT_ID')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Storage safety rules', exact: true })).toBeVisible();
    await expect(page.getByText('Never overwrite original uploads.')).toBeVisible();
    await expect(page.getByText('Do not generate public permanent delivery links.')).toBeVisible();

    await page.goto('/admin/file-storage/connections');
    await expect(page.locator('h1')).toHaveText('Storage connections');
    await expect(page.getByText('Manage provider connection drafts.')).toBeVisible();

    await page.goto('/admin/file-storage/folder-import');
    await expect(page.locator('h1')).toHaveText('Folder import');
    await expect(page.getByText('Plan Drive, Dropbox, local, or mock folder intake')).toBeVisible();

    await page.goto('/admin/file-storage/delivery-export');
    await expect(page.locator('h1')).toHaveText('Delivery export');
    await expect(page.getByText('Plan approved delivery archive exports to storage destinations')).toBeVisible();
  });
});
