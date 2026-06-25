import { test, expect } from '@playwright/test';

test.describe('client dashboard scaffold', () => {
  test('renders client dashboard routes', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'CLIENT_OWNER',
      'x-demo-client-id': 'client_demo_001',
    });

    await page.goto('/client');
    await expect(page.getByRole('heading', { name: 'Your ListingLift image workspace', exact: true })).toBeVisible();
    await expect(page.getByText('Track uploads, active jobs, approved previews, final downloads, revisions, billing, credits, and upgrade options from a client-scoped dashboard. All data must be loaded server-side with tenant and client isolation.')).toBeVisible();
    await expect(page.getByText('Active jobs', { exact: true })).toBeVisible();
    await expect(page.getByText('Ready downloads', { exact: true })).toBeVisible();
    await expect(page.getByText('Open revisions', { exact: true })).toBeVisible();
    await expect(page.getByText('Credits left', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your jobs', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Approved previews', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Downloads', exact: true }).first()).toBeVisible();
    await expect(page.getByText('Only admin-approved previews should be visible here.')).toBeVisible();

    await page.goto('/client/jobs');
    await expect(page.getByRole('heading', { name: 'Your jobs', exact: true }).first()).toBeVisible();
    await expect(page.getByText('Client-scoped active and completed jobs. Codex must replace demo rows with Prisma queries scoped to the active client membership.')).toBeVisible();
    await expect(page.getByText('No client jobs yet')).toBeVisible();

    await page.goto('/client/downloads');
    await expect(page.getByRole('heading', { name: 'Downloads', exact: true }).first()).toBeVisible();
    await expect(page.getByText('Approved final ZIP archives and reports appear here only after delivery gates pass.')).toBeVisible();
    await expect(page.getByText('Final ZIP downloads stay hidden until approval, delivery release, token validity, and client scope checks pass.')).toBeVisible();

    await page.goto('/client/reports');
    await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
    await expect(page.getByText('Approved reports appear here after admin review. Seller review is recommended before publishing marketplace assets.')).toBeVisible();

    await page.goto('/client/revisions');
    await expect(page.getByRole('heading', { name: 'Revisions', exact: true })).toBeVisible();
    await expect(page.getByText('Request revisions for approved previews or delivered files within the project/package allowance.')).toBeVisible();
  });
});
