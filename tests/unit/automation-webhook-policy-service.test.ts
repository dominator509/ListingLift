import { describe, expect, it } from 'vitest';
import { evaluateAutomationProviderReadiness, ensureActionSupported } from '@/server/services/automation-webhook-policy-service';

describe('automation webhook policy service', () => {
  it('allows mock automation without real integrations', () => {
    const result = evaluateAutomationProviderReadiness({ providerKey: 'internal_mock' });
    expect(result.ready).toBe(true);
  });

  it('requires flags and encrypted secrets for Zapier real dispatch', () => {
    const result = evaluateAutomationProviderReadiness({ providerKey: 'zapier_webhook', providerEnabled: false, realIntegrationsEnabled: false });
    expect(result.ready).toBe(false);
    expect(result.warnings.join(' ')).toContain('ZAPIER_WEBHOOKS_ENABLED');
    expect(result.warnings.join(' ')).toContain('Encrypted secret');
  });

  it('blocks unsupported provider actions', () => {
    expect(ensureActionSupported({ providerKey: 'make_webhook', actionKey: 'CREATE_TRELLO_CARD' }).allowed).toBe(false);
  });
});
