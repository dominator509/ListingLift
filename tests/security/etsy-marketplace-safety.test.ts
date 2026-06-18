import { describe, expect, it } from 'vitest';
import { checkEtsyWorkflowSafety } from '@/server/services/etsy-workflow-safety-service';

describe('Etsy marketplace safety', () => {
  it('blocks scraping, password storage, and unauthorized messaging automation', () => {
    const result = checkEtsyWorkflowSafety({ intendedActions: ['scrape private Etsy orders'], storesPassword: true, automatesBuyerMessages: true, scrapesPrivatePages: true, sourceMode: 'MANUAL', externalLinkAllowed: false, editsListingsAutomatically: false });
    expect(result.allowed).toBe(false);
    expect(result.blockingReasons.join(' ')).toContain('password');
    expect(result.blockingReasons.join(' ')).toContain('Scraping');
  });
});
