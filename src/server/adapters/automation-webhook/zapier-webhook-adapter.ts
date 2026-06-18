import type { AutomationWebhookAdapter } from './types';

export const zapierwebhookAdapter: AutomationWebhookAdapter = {
  key: 'zapier_webhook',
  label: 'Zapier webhook',
  async dispatch(payload) {
    if (payload.dryRun) {
      return { providerKey: 'zapier_webhook', status: 'SKIPPED', statusCode: 200, message: 'Dry-run Zapier webhook dispatch planned.', retriable: false, manualFallbackRequired: false };
    }
    if (!payload.endpointUrl) {
      return { providerKey: 'zapier_webhook', status: 'FAILED', message: 'Missing Zapier webhook endpoint URL.', retriable: false, manualFallbackRequired: true };
    }
    return { providerKey: 'zapier_webhook', status: 'SKIPPED', statusCode: 501, message: 'Real Zapier webhook call scaffolded for Codex runtime implementation.', retriable: true, manualFallbackRequired: true };
  },
  async healthCheck() {
    return { ok: true, message: 'Zapier webhook scaffold available; real calls require flags, encrypted secrets, and Codex runtime implementation.' };
  },
};
