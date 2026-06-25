import { expect, test } from '@playwright/test';

test('Phase 30 task notification pages render', async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-demo-user-id': 'test-user-001',
    'x-demo-organization-id': 'test-org-001',
    'x-demo-role': 'SUPER_ADMIN',
  });

  await page.goto('/admin/task-notification-integrations');
  await expect(page.getByRole('heading', { name: 'Task & notification integrations', exact: true })).toBeVisible();
  await expect(page.getByText('Slack, email, Google Sheets, Airtable, Trello, ClickUp, Asana, and Notion')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Provider status', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Integration safety', exact: true })).toBeVisible();
  await expect(page.getByText('No records loaded in the seed scaffold.').first()).toBeVisible();

  await page.goto('/admin/task-notification-integrations/providers');
  await expect(page.getByRole('heading', { name: 'Provider setup', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Provider status', exact: true })).toBeVisible();
  await expect(page.getByText('manually recoverable')).toBeVisible();

  await page.goto('/admin/task-notification-integrations/exports');
  await expect(page.getByRole('heading', { name: 'Data exports', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Data export plan', exact: true })).toBeVisible();
  await expect(page.getByText('tenant-scoped provider state, audit logs, and real runtime checks')).toBeVisible();

  await page.goto('/admin/task-notification-integrations/tasks');
  await expect(page.getByRole('heading', { name: 'Task creation', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Task creation plan', exact: true })).toBeVisible();
  await expect(page.getByText('No records loaded in the seed scaffold.')).toBeVisible();

  await page.goto('/admin/task-notification-integrations/templates');
  await expect(page.locator('h1', { hasText: 'Notification templates' })).toBeVisible();
  await expect(page.locator('h2', { hasText: 'Notification templates' })).toBeVisible();
  await expect(page.getByText('Phase 30 seed UI. Codex must connect this panel')).toBeVisible();

  await page.goto('/admin/task-notification-integrations/health');
  await expect(page.getByRole('heading', { name: 'Integration health', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Task notification health', exact: true })).toBeVisible();
  await expect(page.getByText('real runtime checks')).toBeVisible();
});
