import { redactTaskIntegrationPayload } from '@/domain/task-notification-integrations';
import type { TaskNotificationAdapter } from './types';

export const mockTaskNotificationAdapter: TaskNotificationAdapter = {
  key: 'internal_email',
  label: 'Internal mock notification adapter',
  actions: ['SEND_EMAIL'],
  async healthCheck() {
    return { ok: true, message: 'Mock task notification adapter is available.' };
  },
  async execute(request) {
    return {
      ok: true,
      providerKey: request.providerKey,
      actionKey: request.actionKey,
      status: request.dryRun ? 'DRY_RUN' : 'SENT',
      message: 'Mock task notification adapter accepted the request without external side effects.',
      redactedPayload: redactTaskIntegrationPayload(request.payload),
    };
  },
};
