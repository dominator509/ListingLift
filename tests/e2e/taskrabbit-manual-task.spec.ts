import { test, expect } from '@playwright/test';

test('admin Taskrabbit manual workflow pages render compliance-safe surfaces', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/taskrabbit');
  await expect(page.getByRole('heading', { name: 'Taskrabbit workflow', exact: true })).toBeVisible();
  await expect(page.getByText('Manual-first local-service intake')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Taskrabbit workflow board', exact: true })).toBeVisible();
  await expect(page.getByText('Do not scrape private Taskrabbit pages').first()).toBeVisible();
  await expect(page.getByText('Never guarantee marketplace approval').first()).toBeVisible();

  await page.goto('/admin/taskrabbit/task-intake');
  await expect(page.getByRole('heading', { name: 'Taskrabbit task intake', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Manual Taskrabbit task intake', exact: true })).toBeVisible();
  await expect(page.getByText('/api/taskrabbit/manual-task')).toBeVisible();
  await expect(page.getByText('server-side RBAC, dedupe, tenant isolation, and audit logs')).toBeVisible();
  await expect(page.getByText('Service-to-package mapping')).toBeVisible();

  await page.goto('/admin/taskrabbit/delivery');
  await expect(page.getByRole('heading', { name: 'Taskrabbit delivery', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Delivery message template', exact: true })).toBeVisible();
  await expect(page.getByText('allowed delivery link')).toBeVisible();
  await expect(page.getByText('Please download it before the link expires.')).toBeVisible();

  await page.goto('/admin/taskrabbit/conversions');
  await expect(page.getByRole('heading', { name: 'Taskrabbit conversions', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Direct-retainer conversion tracking', exact: true })).toBeVisible();
  await expect(page.getByText('only where platform rules and customer consent allow')).toBeVisible();
  await expect(page.getByText('monthly image refresh workflow')).toBeVisible();
});
