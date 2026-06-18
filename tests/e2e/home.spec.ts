import { expect, test } from '@playwright/test';

test('home page loads core ListingLift copy', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Turn messy product photos')).toBeVisible();
  await expect(page.getByText('Service packages')).toBeVisible();
});
