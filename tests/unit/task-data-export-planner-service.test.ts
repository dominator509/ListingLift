import { describe, expect, it } from 'vitest';
import { buildTaskDataExportPlan } from '@/server/services/task-data-export-planner-service';

describe('task data export planner', () => {
  it('redacts unsafe keys and plans rows', () => {
    const plan = buildTaskDataExportPlan({ organizationId: 'org_1', providerKey: 'google_sheets', actionKey: 'EXPORT_GOOGLE_SHEET_ROW', exportKind: 'JOB', records: [{ jobId: 'job_1', providerSecret: 'secret' }] });
    expect(plan.rowCount).toBe(1);
    expect(JSON.stringify(plan.rows)).not.toContain('secret');
  });
});
