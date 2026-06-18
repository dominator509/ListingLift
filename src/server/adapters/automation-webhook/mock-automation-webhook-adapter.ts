import type { AutomationWebhookAdapter } from './types';

export const mockAutomationWebhookAdapter: AutomationWebhookAdapter = {
  key: 'internal_mock',
  label: 'Internal mock automation',
  async dispatch(payload) {
    return {
      providerKey: payload.providerKey,
      status: 'SENT',
      statusCode: 202,
      externalRequestId: `mock-${payload.triggerKey.toLowerCase()}-${payload.actionKey.toLowerCase()}`,
      message: 'Mock automation dispatch accepted. No external service was called.',
      retriable: false,
      manualFallbackRequired: false,
    };
  },
  async healthCheck() {
    return { ok: true, message: 'Mock automation adapter healthy.' };
  },
};
