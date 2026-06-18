import { describe, expect, it } from 'vitest';
import { getDeadlineWarningLevel, calculateQueueRank, safeAdminQueueNote } from '@/domain/job-queue';
import { toJobQueueItem, summarizeAdminQueue } from '@/server/services/admin-job-queue-service';

describe('job queue rules', () => {
  it('classifies overdue and due-soon deadlines', () => {
    expect(getDeadlineWarningLevel({ deadline: '2026-06-03T09:00:00.000Z', now: '2026-06-03T12:00:00.000Z' })).toBe('OVERDUE');
    expect(getDeadlineWarningLevel({ deadline: '2026-06-04T09:00:00.000Z', now: '2026-06-03T12:00:00.000Z' })).toBe('DUE_SOON');
  });

  it('weights urgent work ahead of normal work', () => {
    const urgent = calculateQueueRank({ priority: 'URGENT', deadline: '2026-06-05T12:00:00.000Z', createdAt: '2026-06-03T12:00:00.000Z', status: 'WAITING_FOR_UPLOAD' });
    const normal = calculateQueueRank({ priority: 'NORMAL', deadline: '2026-06-05T12:00:00.000Z', createdAt: '2026-06-03T12:00:00.000Z', status: 'WAITING_FOR_UPLOAD' });
    expect(urgent).toBeLessThan(normal);
  });

  it('redacts secret-looking content in admin notes', () => {
    expect(safeAdminQueueNote('key api_key=abc123')).toContain('[redacted]');
  });

  it('builds queue summary counts', () => {
    const items = [toJobQueueItem({ id: '1', title: 'A', status: 'WAITING_FOR_REVIEW', priority: 'HIGH', deadline: '2026-06-03T09:00:00.000Z' }, '2026-06-03T12:00:00.000Z')];
    expect(summarizeAdminQueue(items).overdue).toBe(1);
    expect(summarizeAdminQueue(items).waitingForReview).toBe(1);
  });
});
