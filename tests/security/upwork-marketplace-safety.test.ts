import { describe, expect, it } from 'vitest';
import { evaluateUpworkWorkflowSafety } from '@/server/services/upwork-workflow-safety-service';

describe('upwork marketplace safety', () => {
  it('blocks scraping, password storage, private-page access, and automated messaging', () => {
    const result = evaluateUpworkWorkflowSafety({ intendedActions: ['scrape private page', 'store password', 'auto-message client'] });
    expect(result.allowed).toBe(false);
    expect(result.blockedActions.length).toBe(3);
  });

  it('blocks link-based delivery when external link is not allowed', () => {
    const result = evaluateUpworkWorkflowSafety({ deliveryMode: 'UPWORK_MESSAGE_WITH_ALLOWED_LINK', externalLinkAllowed: false });
    expect(result.allowed).toBe(false);
  });
});
