import { describe, expect, it } from 'vitest';
import { validateImageProviderConfigPolicy } from '@/server/services/image-provider-policy-service';

describe('image provider config policy', () => {
  it('rejects apparent plaintext secret values in config', () => {
    expect(() =>
      validateImageProviderConfigPolicy({
        providerKey: 'remove-bg',
        enabled: true,
        mode: 'real',
        priority: 100,
        config: { apiToken: 'plaintext-token-value' },
        secretRefs: {},
      }),
    ).toThrow(/plaintext secrets/i);
  });

  it('allows secret references while marking real provider blocked by default flags', () => {
    const result = validateImageProviderConfigPolicy({
      providerKey: 'remove-bg',
      enabled: true,
      mode: 'real',
      priority: 100,
      config: { apiKeyRef: 'secret_ref:remove-bg:api-key' },
      secretRefs: { REMOVE_BG_API_KEY: 'secret_ref:remove-bg:api-key' },
    });
    expect(result.missingSecretRefs).toEqual([]);
    expect(result.realProviderBlocked).toBe(true);
  });
});
