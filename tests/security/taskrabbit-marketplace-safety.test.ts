import { describe, expect, it } from 'vitest';
import { evaluateTaskrabbitWorkflowSafety } from '@/server/services/taskrabbit-workflow-safety-service';

describe('taskrabbit marketplace safety', () => {
  it('blocks unsafe automation actions', () => {
    const result = evaluateTaskrabbitWorkflowSafety({ intendedActions: ['scrape private messages', 'auto-message customer'], externalLinkAllowed: false });
    expect(result.ok).toBe(false);
    expect(result.unsafeActions.length).toBeGreaterThan(0);
  });

  it('warns about direct follow-up without consent', () => {
    const result = evaluateTaskrabbitWorkflowSafety({ intendedActions: ['create manual task'], customerConsentForDirectFollowUp: false });
    expect(result.warnings.join(' ')).toContain('Direct-retainer follow-up');
  });
});
