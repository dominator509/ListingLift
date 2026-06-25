import { expect, test } from '@playwright/test';

test.describe('automation webhooks admin shell', () => {
  test('renders automation webhook admin pages', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });

    await page.goto('/admin/automation-webhooks');
    await expect(page.getByRole('heading', { name: 'Automation webhooks', exact: true })).toBeVisible();
    await expect(page.getByText('Configure optional, feature-flagged automation providers for redacted outbound workflow notifications. Manual fallback remains required for every fulfillment path.')).toBeVisible();
    await expect(page.getByText('Internal mock automation')).toBeVisible();
    await expect(page.getByText('Generic signed webhook')).toBeVisible();
    await expect(page.getByText('Zapier webhook')).toBeVisible();
    await expect(page.getByText('Make webhook')).toBeVisible();
    await expect(page.getByText('n8n webhook')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Trigger and action map', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Trigger' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Default actions' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Client visible' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Webhook test mode', exact: true })).toBeVisible();
    await expect(page.getByText('Tests must default to dry-run and mock adapters. Real webhook dispatch requires explicit feature flags, encrypted secret references, rate limits, and audit logging.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send dry-run test' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Automation safety rules', exact: true })).toBeVisible();
    await expect(page.getByText('Automation is optional; fulfillment must continue manually if automation fails.')).toBeVisible();

    await page.goto('/admin/automation-webhooks/subscriptions');
    await expect(page.getByRole('heading', { name: 'Automation subscriptions', exact: true })).toBeVisible();
    await expect(page.getByText('Create dry-run subscriptions that Codex must later persist with RBAC, encrypted secret references, rate limits, and audit logs.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Subscription draft', exact: true })).toBeVisible();
    await expect(page.getByText('Codex must wire this form to tenant-scoped Prisma writes, encrypted secret references, RBAC, audit logs, and rate limits.')).toBeVisible();
    await expect(page.getByLabel('Provider')).toBeVisible();
    await expect(page.getByLabel('Trigger')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create dry-run subscription' })).toBeVisible();

    await page.goto('/admin/automation-webhooks/dead-letter');
    await expect(page.getByRole('heading', { name: 'Automation dead-letter queue', exact: true })).toBeVisible();
    await expect(page.getByText('Failed automations create manual fallback tasks and can be replayed only after operator review.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dead-letter queue', exact: true })).toBeVisible();
    await expect(page.getByText('Failed automation dispatches must never block fulfillment. Codex must persist failures, show manual fallback tasks, and require operator replay confirmation.')).toBeVisible();
    await expect(page.getByText('Show failed provider/action/trigger.')).toBeVisible();
    await expect(page.getByText('Show redacted payload only.')).toBeVisible();
    await expect(page.getByText('Allow replay only with RBAC and audit logging.')).toBeVisible();
  });
});
