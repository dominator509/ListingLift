import { test, expect } from '@playwright/test';

test('admin delivery archive page renders phase 12 shell', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/jobs/job_demo_001/delivery');
  await expect(page.getByRole('heading', { name: 'Delivery archive planning', exact: true })).toBeVisible();
  await expect(page.getByText('Phase 12 seeds smart naming, preset-generated folders, manifest rows, ReadMe safety copy, and ZIP archive planning. Codex must connect this page to real approved processed files and storage before any client-facing download is enabled.')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'ZIP archive summary', exact: true })).toBeVisible();
  await expect(page.getByText('Final downloads must remain hidden until admin approval and delivery visibility checks pass.')).toBeVisible();
  await expect(page.getByText('ListingLift_Delivery_Demo-Store_JOB-123.zip')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Delivery package checklist', exact: true })).toBeVisible();
  await expect(page.getByText('Codex must enforce these checks server-side before marking Phase 12 complete.')).toBeVisible();
  await expect(page.getByText('Originals preserved')).toBeVisible();
  await expect(page.getByText('Admin approval required before client download')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'File naming preview', exact: true })).toBeVisible();
  await expect(page.getByText('Safe, predictable names avoid special characters and keep SKU/job/preset context.')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Delivery folder tree', exact: true })).toBeVisible();
  await expect(page.getByText('Generated from selected platform presets. Paths must remain ZIP-safe and predictable.')).toBeVisible();
  await expect(page.getByText('Manifest.csv')).toBeVisible();
  await expect(page.getByText('ReadMe.txt')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Manifest preview', exact: true })).toBeVisible();
  await expect(page.getByText('Manifest rows include source image, output path, preset, dimensions, format, and seller-review status.')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Output' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Preset' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Dimensions' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
});
