import { redactTaskIntegrationPayload } from '@/domain/task-notification-integrations';
import type { TaskNotificationAdapter } from './types';

export const asanaTaskAdapter: TaskNotificationAdapter = {
  key: 'asana',
  label: 'Asana task adapter',
  actions: ['CREATE_ASANA_TASK'],
  async healthCheck() {
    return { ok: true, message: 'Asana task adapter scaffold is configured for dry-run checks. Codex must wire the real provider behind feature flags.' };
  },
  async execute(request) {
    return {
      ok: true,
      providerKey: request.providerKey,
      actionKey: request.actionKey,
      status: request.dryRun ? 'DRY_RUN' : 'MANUAL_FALLBACK',
      message: request.dryRun
        ? 'Asana task adapter dry-run plan created.'
        : 'Real Asana task adapter calls must be implemented by Codex behind feature flags and encrypted secret references.',
      redactedPayload: redactTaskIntegrationPayload(request.payload),
    };
  },
};
