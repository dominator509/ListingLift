import { expect, test } from '@playwright/test';

test.describe('phase 36 API access scaffold', () => {
  test('renders API access, tokens, scopes, webhooks, shared portal, and integrations shells', async ({ page }) => {
    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'SUPER_ADMIN',
    });

    await page.goto('/admin/api-access');
    await expect(page.getByRole('heading', { name: 'API access and advanced integrations', exact: true })).toBeVisible();
    await expect(page.getByText('Admin shell for API tokens, scope enforcement, plan gates, shared upload portals, and Zapier/Make/n8n/custom API scaffolds. Codex must wire hashed-token persistence, RBAC, tenant isolation, rate limits, and audits.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'API tokens', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Advanced integrations', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Webhook management', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Shared upload portals', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Phase 36 guardrails', exact: true })).toBeVisible();

    await page.goto('/admin/api-access/tokens');
    await expect(page.getByRole('heading', { name: 'API token management', exact: true })).toBeVisible();
    await expect(page.getByText('Create, revoke, rotate, and review API tokens. Raw tokens must be shown once only and stored as hashes.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'API tokens', exact: true })).toBeVisible();
    await expect(page.getByText('Tokens must be shown once, stored only as hashes, scoped to the tenant, and gated by active plan entitlements.')).toBeVisible();

    await page.goto('/admin/api-access/scopes');
    await expect(page.getByRole('heading', { name: 'API scope matrix', exact: true })).toBeVisible();
    await expect(page.getByText('Review Phase 36 scopes and plan gates for jobs, uploads, images, deliveries, webhooks, and presets.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Scope matrix', exact: true })).toBeVisible();
    await expect(page.getByText('Phase 36 scopes map API capability to plan gating and enforcement risk.')).toBeVisible();

    await page.goto('/admin/api-access/webhooks');
    await expect(page.getByRole('heading', { name: 'API webhook subscriptions', exact: true })).toBeVisible();
    await expect(page.getByText('Outbound webhook scaffold with signing secret references, retry/dead-letter requirements, rate limits, and audit events.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Webhook management', exact: true })).toBeVisible();
    await expect(page.getByText('Outbound webhooks require signing-secret references, retries, dead-letter handling, rate limits, and no raw secret exposure.')).toBeVisible();

    await page.goto('/admin/api-access/shared-upload-portal');
    await expect(page.getByRole('heading', { name: 'Shared upload portal scaffold', exact: true })).toBeVisible();
    await expect(page.getByText('Agency/API upload intake portals with hashed expiring tokens, original-upload preservation, unsafe file rejection, and manual review.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Shared upload portals', exact: true })).toBeVisible();
    await expect(page.getByText('Portal links are API-adjacent intake scaffolds for agencies and automations. Tokens are shown once, hashed, scoped, expiring, and original-preserving.')).toBeVisible();

    await page.goto('/admin/api-access/integrations');
    await expect(page.getByRole('heading', { name: 'Advanced integration catalog', exact: true })).toBeVisible();
    await expect(page.getByText('Zapier, Make, n8n, custom API client, and webhook scaffolds remain disabled by default until feature flags and encrypted secret references are verified.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Advanced integrations', exact: true })).toBeVisible();
    await expect(page.getByText('Zapier, Make, n8n, custom API clients, and webhook workflows stay disabled by default until feature flags and encrypted secret references are wired.')).toBeVisible();
  });
});
