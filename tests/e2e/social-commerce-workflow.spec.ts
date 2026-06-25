import { expect, test } from '@playwright/test';

test('admin social-commerce workflow pages render platform-safe manual surfaces', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/social-commerce');
  await expect(page.getByRole('heading', { name: 'Social commerce workflows', exact: true })).toBeVisible();
  await expect(page.getByText('Manual and platform-safe intake')).toBeVisible();
  await expect(page.getByText('TikTok Shop', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Social-commerce safety rules', exact: true })).toBeVisible();
  await expect(page.getByText('Do not scrape private social-commerce pages')).toBeVisible();
  await expect(page.getByText('Do not store platform passwords')).toBeVisible();

  await page.goto('/admin/social-commerce/order-intake');
  await expect(page.getByRole('heading', { name: 'Social-commerce order intake', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Manual social-commerce order intake', exact: true })).toBeVisible();
  await expect(page.getByText('without scraping, password storage, or unsafe automation')).toBeVisible();
  await expect(page.getByText('source channel, buyer handle, product names')).toBeVisible();

  await page.goto('/admin/social-commerce/creative-plan');
  await expect(page.getByRole('heading', { name: 'Social-commerce creative plans', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Creative plan preview', exact: true })).toBeVisible();
  await expect(page.getByText('ListingLift prepares social-commerce image drafts')).toBeVisible();
  await expect(page.getByText('Formats: SQUARE_POST, STORY_REEL, SHOP_PRODUCT_CARD')).toBeVisible();
  await expect(page.getByText('Presets: InstagramSquare, InstagramStoryReelVertical, TransparentPNG')).toBeVisible();

  await page.goto('/admin/social-commerce/delivery');
  await expect(page.getByRole('heading', { name: 'Social-commerce delivery', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Delivery message template', exact: true })).toBeVisible();
  await expect(page.getByText('approved manual platform-safe workflow')).toBeVisible();
  await expect(page.getByText('Platform approval, product approval, marketplace ranking')).toBeVisible();

  await page.goto('/admin/social-commerce/revisions');
  await expect(page.getByRole('heading', { name: 'Social-commerce revisions', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Revision tracker', exact: true })).toBeVisible();
  await expect(page.getByText('block completion while revisions are requested')).toBeVisible();
});
