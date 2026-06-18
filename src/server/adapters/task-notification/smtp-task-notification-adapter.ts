import { redactTaskIntegrationPayload } from '@/domain/task-notification-integrations';
import type { TaskNotificationAdapter } from './types';

export const smtpTaskNotificationAdapter: TaskNotificationAdapter = {
  key: 'smtp_email',
  label: 'SMTP task email adapter',
  actions: ['SEND_EMAIL'],
  async healthCheck() {
    return { ok: true, message: 'SMTP task email adapter scaffold is configured for dry-run checks. Codex must wire the real provider behind feature flags.' };
  },
  async execute(request) {
    return {
      ok: true,
      providerKey: request.providerKey,
      actionKey: request.actionKey,
      status: request.dryRun ? 'DRY_RUN' : 'MANUAL_FALLBACK',
      message: request.dryRun
        ? 'SMTP task email adapter dry-run plan created.'
        : 'Real SMTP task email adapter calls must be implemented by Codex behind feature flags and encrypted secret references.',
      redactedPayload: redactTaskIntegrationPayload(request.payload),
    };
  },
};
