import { describe, expect, it } from 'vitest';
import { buildRevisionRequestDraft, buildRevisionStatusUpdate, summarizeRevisionQueue } from '@/server/services/revision-workflow-service';

describe('revision workflow service', () => {
  it('sanitizes revision text and moves job to revision requested', () => {
    const draft = buildRevisionRequestDraft({ jobId: 'job-1', requestText: '<b>Fix edges</b>', requestedBy: 'CLIENT', clientVisible: true }, { organizationId: 'org-1', actorUserId: 'user-1' });
    expect(draft.requestText).toBe('bFix edges/b');
    expect(draft.nextJobStatus).toBe('REVISION_REQUESTED');
  });

  it('summarizes open revisions as final-approval blockers', () => {
    const summary = summarizeRevisionQueue([{ status: 'OPEN', clientVisible: true }, { status: 'RESOLVED' }]);
    expect(summary.blocksFinalApproval).toBe(true);
    expect(summary.open).toBe(1);
  });

  it('maps in-progress revision to reprocessing', () => {
    const update = buildRevisionStatusUpdate({ revisionId: 'rev-1', status: 'IN_PROGRESS', reprocessRequested: true, manualReplacementUploaded: false }, { organizationId: 'org-1' });
    expect(update.nextJobStatus).toBe('REPROCESSING');
  });
});
