import { describe, expect, it } from 'vitest';
import { checkShopifyWorkflowSafety } from '@/server/services/shopify-workflow-safety-service';

describe('Shopify marketplace safety', () => {
  it('blocks scraping, password storage, frontend token exposure, and unapproved auto replacement', () => {
    const safety = checkShopifyWorkflowSafety({
      sourceMode: 'MANUAL',
      externalLinkAllowed: false,
      scrapesPrivatePages: false,
      intendedActions: ['scrape Shopify admin', 'auto replace image'],
      storesPassword: true,
      exposesOauthTokenToFrontend: true,
      autoReplacesImages: true,
      hasMerchantApprovalForReplacement: false,
    });
    expect(safety.allowed).toBe(false);
    expect(safety.blockers.join(' ')).toContain('Do not store Shopify passwords');
    expect(safety.blockers.join(' ')).toContain('Do not expose Shopify OAuth access tokens');
  });
});
