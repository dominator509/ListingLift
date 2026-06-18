import { describe, expect, it } from 'vitest';
import { buildTaskCreationPlan } from '@/server/services/task-creation-planner-service';

describe('task creation planner', () => {
  it('creates dry-run Trello plan', () => {
    const plan = buildTaskCreationPlan({ organizationId: 'org_1', providerKey: 'trello', actionKey: 'CREATE_TRELLO_CARD', title: 'Review outputs', description: 'QC needed' });
    expect(plan.providerKey).toBe('trello');
    expect(plan.dryRun).toBe(true);
  });
});
