import { taskDataExportInputSchema } from '@/schemas/task-notification-integrations';
import { redactTaskIntegrationPayload } from '@/domain/task-notification-integrations';

function sanitizeRecord(record: Record<string, unknown>) {
  const disallowed = ['rawFileBytes', 'downloadToken', 'deliveryToken', 'providerSecret', 'marketplacePassword', 'privateNotes'];
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (!disallowed.includes(key)) safe[key] = value;
  }
  return redactTaskIntegrationPayload(safe);
}

export function buildTaskDataExportPlan(input: unknown) {
  const parsed = taskDataExportInputSchema.parse(input);
  const rows = parsed.records.map(sanitizeRecord);
  return {
    providerKey: parsed.providerKey,
    actionKey: parsed.actionKey,
    exportKind: parsed.exportKind,
    dryRun: parsed.dryRun,
    rowCount: rows.length,
    rows,
    destination: 'configured-by-codex',
    persistence: 'dry-run',
  };
}
