import { describe, expect, it } from 'vitest';
import { buildBulkPreviewApprovalPlan } from '@/server/services/bulk-preview-approval-service';

describe('buildBulkPreviewApprovalPlan', () => {
  it('only approves ready-for-review outputs and skips flagged/failed outputs', () => {
    const plan = buildBulkPreviewApprovalPlan({
      organizationId: 'org',
      jobId: 'job',
      selectedProcessedFileIds: ['ready', 'flagged', 'failed'],
      processedFiles: [
        { id: 'ready', outputFileName: 'ready.jpg', outputType: 'WHITE_JPG', status: 'READY_FOR_REVIEW', approvedStatus: 'PENDING' },
        { id: 'flagged', outputFileName: 'flagged.jpg', outputType: 'WHITE_JPG', status: 'FLAGGED', approvedStatus: 'PENDING', qualityFlags: ['edge'] },
        { id: 'failed', outputFileName: 'failed.jpg', outputType: 'WHITE_JPG', status: 'FAILED', approvedStatus: 'PENDING' },
      ],
    });
    expect(plan.approvableIds).toEqual(['ready']);
    expect(plan.skippedCount).toBe(2);
    expect(plan.warning).toContain('not final delivery approval');
  });
});
