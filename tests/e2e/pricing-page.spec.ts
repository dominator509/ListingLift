import { expect, test } from '@playwright/test';

test.describe('pricing page smoke', () => {
  test('shows data-driven package language and safe marketplace wording', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: /Product image cleanup packages/i })).toBeVisible();
    await expect(page.getByText(/Marketplace Listing Pack — 25 Images/i).first()).toBeVisible();
    await expect(page.getByText(/seller review/i).first()).toBeVisible();
  });
});
