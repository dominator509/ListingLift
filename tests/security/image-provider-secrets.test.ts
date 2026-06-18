import { describe, expect, it } from 'vitest';
import { containsPlaintextSecret, redactImageProviderConfig } from '@/domain/image-providers';
import { validateImageProviderSecretRefs } from '@/server/services/image-provider-secret-service';

describe('image provider secret safety', () => {
  it('detects plaintext secret-looking provider config', () => {
    expect(containsPlaintextSecret({ apiToken: 'raw-secret' })).toBe(true);
    expect(containsPlaintextSecret({ apiTokenRef: 'secret_ref:provider:key' })).toBe(false);
  });

  it('redacts secret-like keys before returning config to UI', () => {
    expect(redactImageProviderConfig({ apiToken: 'raw-secret', timeoutMs: 30000 })).toEqual({ apiToken: '[redacted]', timeoutMs: 30000 });
  });

  it('reports missing encrypted secret references without returning secret values', () => {
    const result = validateImageProviderSecretRefs({ providerKey: 'remove-bg', secretRefs: {} });
    expect(result.complete).toBe(false);
    expect(result.missingSecretNames).toContain('REMOVE_BG_API_KEY');
    expect(JSON.stringify(result)).not.toContain('raw-secret');
  });
});
