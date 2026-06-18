import { redactTaskIntegrationPayload } from '@/domain/task-notification-integrations';
import type { TaskNotificationAdapter } from './types';

export const trelloTaskAdapter: TaskNotificationAdapter = {
  key: 'trello',
  label: 'Trello task adapter',
  actions: ['CREATE_TRELLO_CARD'],
  async healthCheck() {
    return { ok: true, message: 'Trello task adapter scaffold is configured for dry-run checks. Codex must wire the real provider behind feature flags.' };
  },
  async execute(request) {
    return {
      ok: true,
      providerKey: request.providerKey,
      actionKey: request.actionKey,
      status: request.dryRun ? 'DRY_RUN' : 'MANUAL_FALLBACK',
      message: request.dryRun
        ? 'Trello task adapter dry-run plan created.'
        : 'Real Trello task adapter calls must be implemented by Codex behind feature flags and encrypted secret references.',
      redactedPayload: redactTaskIntegrationPayload(request.payload),
    };
  },
};
