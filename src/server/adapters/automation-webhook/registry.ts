import type { AutomationWebhookProviderKey } from '@/domain/automation-webhooks';
import type { AutomationWebhookAdapter } from './types';
import { mockAutomationWebhookAdapter } from './mock-automation-webhook-adapter';
import { genericWebhookAdapter } from './generic-webhook-adapter';
import { zapierwebhookAdapter } from './zapier-webhook-adapter';
import { makewebhookAdapter } from './make-webhook-adapter';
import { n8nwebhookAdapter } from './n8n-webhook-adapter';

const adapters: Record<AutomationWebhookProviderKey, AutomationWebhookAdapter> = {
  internal_mock: mockAutomationWebhookAdapter,
  generic_webhook: genericWebhookAdapter,
  zapier_webhook: zapierwebhookAdapter,
  make_webhook: makewebhookAdapter,
  n8n_webhook: n8nwebhookAdapter,
};

export function getAutomationWebhookAdapter(key: AutomationWebhookProviderKey) {
  return adapters[key];
}

export function listAutomationWebhookAdapters() {
  return Object.values(adapters).map((adapter) => ({ key: adapter.key, label: adapter.label }));
}
