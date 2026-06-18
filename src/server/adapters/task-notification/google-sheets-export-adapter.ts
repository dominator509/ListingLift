import { redactTaskIntegrationPayload } from '@/domain/task-notification-integrations';
import type { TaskNotificationAdapter } from './types';

export const googleSheetsExportAdapter: TaskNotificationAdapter = {
  key: 'google_sheets',
  label: 'Google Sheets export adapter',
  actions: ['EXPORT_GOOGLE_SHEET_ROW', 'EXPORT_REPORT_DATA'],
  async healthCheck() {
    return { ok: true, message: 'Google Sheets export adapter scaffold is configured for dry-run checks. Codex must wire the real provider behind feature flags.' };
  },
  async execute(request) {
    return {
      ok: true,
      providerKey: request.providerKey,
      actionKey: request.actionKey,
      status: request.dryRun ? 'DRY_RUN' : 'MANUAL_FALLBACK',
      message: request.dryRun
        ? 'Google Sheets export adapter dry-run plan created.'
        : 'Real Google Sheets export adapter calls must be implemented by Codex behind feature flags and encrypted secret references.',
      redactedPayload: redactTaskIntegrationPayload(request.payload),
    };
  },
};
