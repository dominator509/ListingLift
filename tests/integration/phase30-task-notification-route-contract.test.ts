import { describe, expect, it } from 'vitest';
import { taskNotificationAlertInputSchema, taskDataExportInputSchema, taskCreationInputSchema } from '@/schemas/task-notification-integrations';

describe('Phase 30 route contracts', () => {
  it('validates alert, export, and task creation payloads', () => {
    expect(taskNotificationAlertInputSchema.parse({ organizationId: 'org_1', providerKey: 'slack', eventKey: 'WAITING_FOR_REVIEW', title: 'Review', message: 'Outputs ready' }).dryRun).toBe(true);
    expect(taskDataExportInputSchema.parse({ organizationId: 'org_1', providerKey: 'airtable', actionKey: 'EXPORT_AIRTABLE_RECORD', exportKind: 'JOB', records: [{ jobId: 'job_1' }] }).records).toHaveLength(1);
    expect(taskCreationInputSchema.parse({ organizationId: 'org_1', providerKey: 'clickup', actionKey: 'CREATE_CLICKUP_TASK', title: 'QC job' }).dryRun).toBe(true);
  });
});
