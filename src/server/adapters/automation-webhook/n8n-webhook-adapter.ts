import type { AutomationWebhookAdapter } from './types';

export const n8nwebhookAdapter: AutomationWebhookAdapter = {
  key: 'n8n_webhook',
  label: 'n8n webhook',
  async dispatch(payload) {
    if (payload.dryRun) {
      return { providerKey: 'n8n_webhook', status: 'SKIPPED', statusCode: 200, message: 'Dry-run n8n webhook dispatch planned.', retriable: false, manualFallbackRequired: false };
    }
    if (!payload.endpointUrl) {
      return { providerKey: 'n8n_webhook', status: 'FAILED', message: 'Missing n8n webhook endpoint URL.', retriable: false, manualFallbackRequired: true };
    }
    return { providerKey: 'n8n_webhook', status: 'SKIPPED', statusCode: 501, message: 'Real n8n webhook call scaffolded for Codex runtime implementation.', retriable: true, manualFallbackRequired: true };
  },
  async healthCheck() {
    return { ok: true, message: 'n8n webhook scaffold available; real calls require flags, encrypted secrets, and Codex runtime implementation.' };
  },
};
