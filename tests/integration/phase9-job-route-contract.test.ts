import { describe, expect, it } from 'vitest';
import { manualJobCreateSchema, adminJobQueueFilterSchema, jobStatusTransitionSchema } from '@/schemas/job';

describe('phase 9 job route contracts', () => {
  it('accepts canonical admin queue filters', () => {
    const parsed = adminJobQueueFilterSchema.parse({ status: ['WAITING_FOR_UPLOAD'], priority: ['HIGH'], sortBy: 'deadline', sortDirection: 'asc' });
    expect(parsed.pageSize).toBe(25);
  });

  it('accepts manual job creation payloads', () => {
    const parsed = manualJobCreateSchema.parse({ clientName: 'Demo', title: 'Quick Cleanup', packageKey: 'quick-cleanup-pack', targetPlatform: 'Shopify', imageQuantity: 10 });
    expect(parsed.sourceChannelName).toBe('manual');
    expect(parsed.priority).toBe('NORMAL');
  });

  it('normalizes status transition payloads', () => {
    const parsed = jobStatusTransitionSchema.parse({ nextStatus: 'UPLOAD_RECEIVED' });
    expect(parsed.manualOverride).toBe(false);
  });
});
