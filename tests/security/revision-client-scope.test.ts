import { describe, expect, it } from 'vitest';
import { buildRevisionRequestDraft } from '@/server/services/revision-workflow-service';

describe('revision client scope contract', () => {
  it('requires server-side organization context rather than trusting client org id', () => {
    const draft = buildRevisionRequestDraft({ jobId: 'job-1', clientId: 'client-1', requestText: 'Please adjust crop', requestedBy: 'CLIENT', clientVisible: true }, { organizationId: 'server-org' });
    expect(draft.organizationId).toBe('server-org');
    expect(draft.requiresTransaction).toBe(true);
  });
});
