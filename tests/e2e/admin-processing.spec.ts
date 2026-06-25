import { test, expect } from '@playwright/test';

test('admin processing page renders pipeline shell', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/processing');
  await expect(page.getByRole('heading', { name: 'Image processing pipeline', exact: true })).toBeVisible();
  await expect(page.getByText('Queue, process, and review output generation while preserving originals and keeping final downloads hidden until approval.')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Pipeline status', exact: true })).toBeVisible();
  await expect(page.getByText('Tracks queued, running, completed, failed, and manual-fallback processing outputs.')).toBeVisible();
  await expect(page.getByText('failed outputs require admin review or manual fallback.')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Run summary', exact: true })).toBeVisible();
  await expect(page.getByText('Phase 11 run contract before persistence and worker execution.')).toBeVisible();
  await expect(page.getByText('mock-image-provider', { exact: true })).toBeVisible();
  await expect(page.getByText('Manual fallback', { exact: true })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Output plan', exact: true })).toBeVisible();
  await expect(page.getByText('Preset-driven files that will become ProcessedFile rows and review-ready outputs.')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Output' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Preset' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Dimensions' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Folder' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Review' })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Processing steps', exact: true })).toBeVisible();
  await expect(page.getByText('Deterministic step plan for each image/output. Codex must persist step status changes transactionally.')).toBeVisible();
  await expect(page.getByText(/Image img_demo_1 .* provider mock-image-provider/).first()).toBeVisible();
});
