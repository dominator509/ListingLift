import { describe, expect, it } from 'vitest';
import { createTaskrabbitManualTaskPlan } from '@/server/services/taskrabbit-task-intake-service';
import { createTaskrabbitConversionUpdatePlan } from '@/server/services/taskrabbit-conversion-service';

describe('phase 22 taskrabbit route contracts', () => {
  it('plans manual task intake without persistence in ChatGPT seed mode', () => {
    const plan = createTaskrabbitManualTaskPlan({ taskId: 'TR-456', customerName: 'Local Buyer', taskTitle: 'Restaurant menu photo cleanup', taskCategory: 'RESTAURANT_MENU_CLEANUP', taskValueCents: 22500, dryRun: true, taskValue: 225, currency: 'USD', conversionStatus: 'FOLLOW_UP_NEEDED', externalLinkAllowed: false, uploadStatus: 'WAITING_FOR_UPLOAD', appointmentStatus: 'SCHEDULED' });
    expect(plan.mode).toBe('DRY_RUN');
    expect(plan.externalOrderDraft.normalized.channelName).toBe('Taskrabbit');
  });

  it('plans conversion tracking as an audited manual mutation', () => {
    const plan = createTaskrabbitConversionUpdatePlan({ taskId: 'TR-456', conversionStatus: 'INTERESTED', dryRun: true });
    expect(plan.shouldAudit).toBe(true);
    expect(plan.requiresConsentBeforeDirectOutreach).toBe(true);
  });
});
