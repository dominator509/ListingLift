import { redactTaskIntegrationPayload } from '@/domain/task-notification-integrations';
import type { TaskNotificationAdapter } from './types';

export const notionTaskExportAdapter: TaskNotificationAdapter = {
  key: 'notion',
  label: 'Notion task/export adapter',
  actions: ['CREATE_NOTION_PAGE', 'EXPORT_REPORT_DATA'],
  async healthCheck() {
    return { ok: true, message: 'Notion task/export adapter scaffold is configured for dry-run checks. Codex must wire the real provider behind feature flags.' };
  },
  async execute(request) {
    return {
      ok: true,
      providerKey: request.providerKey,
      actionKey: request.actionKey,
      status: request.dryRun ? 'DRY_RUN' : 'MANUAL_FALLBACK',
      message: request.dryRun
        ? 'Notion task/export adapter dry-run plan created.'
        : 'Real Notion task/export adapter calls must be implemented by Codex behind feature flags and encrypted secret references.',
      redactedPayload: redactTaskIntegrationPayload(request.payload),
    };
  },
};
