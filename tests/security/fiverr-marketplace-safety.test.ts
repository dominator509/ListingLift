import { describe, expect, it } from 'vitest';
import { checkFiverrWorkflowSafety } from '@/server/services/fiverr-workflow-safety-service';

describe('Fiverr marketplace safety', () => {
  it('blocks scraping and password storage', () => {
    const safety = checkFiverrWorkflowSafety({ intendedActions: ['scrape private page', 'store password'] });
    expect(safety.allowed).toBe(false);
    expect(safety.blockedActions.length).toBeGreaterThan(0);
  });

  it('blocks external delivery link unless explicitly allowed', () => {
    const safety = checkFiverrWorkflowSafety({ deliveryMode: 'FIVERR_MESSAGE_WITH_ALLOWED_LINK', externalLinkAllowed: false });
    expect(safety.allowed).toBe(false);
  });
});
