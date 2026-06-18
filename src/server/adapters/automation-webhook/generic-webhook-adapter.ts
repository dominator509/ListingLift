import type { AutomationWebhookAdapter } from './types';

export const genericWebhookAdapter: AutomationWebhookAdapter = {
  key: 'generic_webhook',
  label: 'Generic signed webhook',
  async dispatch(payload) {
    if (payload.dryRun) {
      return { providerKey: 'generic_webhook', status: 'SKIPPED', statusCode: 200, message: 'Dry-run generic webhook dispatch planned.', retriable: false, manualFallbackRequired: false };
    }
    if (!payload.endpointUrl) {
      return { providerKey: 'generic_webhook', status: 'FAILED', message: 'Missing endpoint URL.', retriable: false, manualFallbackRequired: true };
    }
    return { providerKey: 'generic_webhook', status: 'SKIPPED', statusCode: 501, message: 'Real generic webhook call scaffolded for Codex runtime implementation.', retriable: true, manualFallbackRequired: true };
  },
  async healthCheck() {
    return { ok: true, message: 'Generic webhook scaffold available; real calls require runtime implementation.' };
  },
};
