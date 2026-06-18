import { redactTaskIntegrationPayload } from '@/domain/task-notification-integrations';
import type { TaskNotificationAdapter } from './types';

export const airtableExportAdapter: TaskNotificationAdapter = {
  key: 'airtable',
  label: 'Airtable export adapter',
  actions: ['EXPORT_AIRTABLE_RECORD', 'EXPORT_REPORT_DATA'],
  async healthCheck() {
    return { ok: true, message: 'Airtable export adapter scaffold is configured for dry-run checks. Codex must wire the real provider behind feature flags.' };
  },
  async execute(request) {
    return {
      ok: true,
      providerKey: request.providerKey,
      actionKey: request.actionKey,
      status: request.dryRun ? 'DRY_RUN' : 'MANUAL_FALLBACK',
      message: request.dryRun
        ? 'Airtable export adapter dry-run plan created.'
        : 'Real Airtable export adapter calls must be implemented by Codex behind feature flags and encrypted secret references.',
      redactedPayload: redactTaskIntegrationPayload(request.payload),
    };
  },
};
