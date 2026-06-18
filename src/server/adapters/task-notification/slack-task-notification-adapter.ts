import { redactTaskIntegrationPayload } from '@/domain/task-notification-integrations';
import type { TaskNotificationAdapter } from './types';

export const slackTaskNotificationAdapter: TaskNotificationAdapter = {
  key: 'slack',
  label: 'Slack notification adapter',
  actions: ['SEND_SLACK_ALERT'],
  async healthCheck() {
    return { ok: true, message: 'Slack notification adapter scaffold is configured for dry-run checks. Codex must wire the real provider behind feature flags.' };
  },
  async execute(request) {
    return {
      ok: true,
      providerKey: request.providerKey,
      actionKey: request.actionKey,
      status: request.dryRun ? 'DRY_RUN' : 'MANUAL_FALLBACK',
      message: request.dryRun
        ? 'Slack notification adapter dry-run plan created.'
        : 'Real Slack notification adapter calls must be implemented by Codex behind feature flags and encrypted secret references.',
      redactedPayload: redactTaskIntegrationPayload(request.payload),
    };
  },
};
