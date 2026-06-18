import { describe, expect, it } from 'vitest';
import { buildTaskNotificationSafetyReport } from '@/server/services/task-notification-safety-service';

describe('task notification payload safety', () => {
  it('detects file/token payload leakage', () => {
    const report = buildTaskNotificationSafetyReport({ payload: { downloadToken: 'abc', rawFileBytes: 'bytes' } });
    expect(report.ok).toBe(false);
    expect(report.unsafeFilePayloadDetected).toBe(true);
  });
});
