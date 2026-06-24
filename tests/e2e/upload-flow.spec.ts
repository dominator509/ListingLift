import { expect, test } from '@playwright/test';

test('upload token page exposes secure intake language', async ({ page }) => {
  await page.goto('/upload/demo-token-1234567890');
  await expect(page.getByRole('heading', { name: /Upload product photos/i })).toBeVisible();
  await expect(page.getByText(/original uploads are preserved/i)).toBeVisible();
  await expect(page.getByText(/Final delivery remains hidden until admin approval/i)).toBeVisible();
  await expect(page.getByText(/Reject path traversal and absolute paths/i)).toBeVisible();
  await expect(page.getByText(/Manual fallback/i)).toBeVisible();
});
