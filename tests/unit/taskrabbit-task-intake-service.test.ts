import { describe, expect, it } from 'vitest';
import { createTaskrabbitManualTaskPlan } from '@/server/services/taskrabbit-task-intake-service';

describe('taskrabbit task intake service', () => {
  it('creates a normalized dry-run plan for a local task', () => {
    const plan = createTaskrabbitManualTaskPlan({
      taskId: 'tr 123',
      customerName: 'Riley Local',
      taskTitle: 'Clean up marketplace listing photos',
      taskCategory: 'MARKETPLACE_LISTING_HELP',
      taskValue: 125,
      taskValueCents: 12500,
      currency: 'USD',
      appointmentStatus: 'SCHEDULED',
      conversionStatus: 'FOLLOW_UP_NEEDED',
      externalLinkAllowed: false,
      uploadStatus: 'NOT_STARTED',
      dryRun: true,
    });
    expect(plan.mode).toBe('DRY_RUN');
    expect(plan.externalOrderDraft.provider).toBe('taskrabbit');
    expect(plan.externalOrderDraft.dedupeKey).toBe('taskrabbit:TR-123');
    expect(plan.jobDraft.sourceChannel).toBe('Taskrabbit');
    expect(plan.uploadLinkPlan.shouldCreateUploadToken).toBe(true);
  });
});
