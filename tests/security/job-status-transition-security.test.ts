import { describe, expect, it } from 'vitest';
import { buildJobTransitionDraft, assertStatusTransitionCanExposeDelivery } from '@/server/services/job-status-transition-service';

describe('job status transition security', () => {
  it('requires notes for failed/cancelled/revision transitions', () => {
    expect(() => buildJobTransitionDraft({ currentStatus: 'PROCESSING', transition: { nextStatus: 'FAILED', manualOverride: true } })).toThrow(/note or reason/);
  });

  it('blocks delivery-visible statuses without admin approval', () => {
    expect(() => assertStatusTransitionCanExposeDelivery({ nextStatus: 'READY_FOR_DELIVERY' })).toThrow(/Admin approval/);
  });

  it('allows valid non-delivery transition draft', () => {
    const draft = buildJobTransitionDraft({ currentStatus: 'WAITING_FOR_UPLOAD', transition: { nextStatus: 'UPLOAD_RECEIVED', manualOverride: false } });
    expect(draft.auditAction).toBe('job_status_changed');
  });
});
