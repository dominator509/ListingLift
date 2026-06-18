import type { AutomationWebhookAdapter } from './types';

export const makewebhookAdapter: AutomationWebhookAdapter = {
  key: 'make_webhook',
  label: 'Make webhook',
  async dispatch(payload) {
    if (payload.dryRun) {
      return { providerKey: 'make_webhook', status: 'SKIPPED', statusCode: 200, message: 'Dry-run Make webhook dispatch planned.', retriable: false, manualFallbackRequired: false };
    }
    if (!payload.endpointUrl) {
      return { providerKey: 'make_webhook', status: 'FAILED', message: 'Missing Make webhook endpoint URL.', retriable: false, manualFallbackRequired: true };
    }
    return { providerKey: 'make_webhook', status: 'SKIPPED', statusCode: 501, message: 'Real Make webhook call scaffolded for Codex runtime implementation.', retriable: true, manualFallbackRequired: true };
  },
  async healthCheck() {
    return { ok: true, message: 'Make webhook scaffold available; real calls require flags, encrypted secrets, and Codex runtime implementation.' };
  },
};
