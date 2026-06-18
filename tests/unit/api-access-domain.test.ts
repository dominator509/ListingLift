import { describe, expect, it } from 'vitest';
import { apiCopyContainsUnsafeGuarantee, evaluateApiPlanGate, normalizeApiScopes, sanitizeApiEventMetadata } from '@/domain/api-access';

describe('api access domain', () => {
  it('normalizes scopes and gates them by plan', () => {
    expect(normalizeApiScopes(['jobs:create', 'jobs:create', 'unknown'])).toEqual(['jobs:create']);
    const agencyGate = evaluateApiPlanGate({ planKey: 'AGENCY', requestedScopes: ['jobs:create', 'uploads:create', 'presets:read'] });
    expect(agencyGate.allowed).toBe(true);
    const denied = evaluateApiPlanGate({ planKey: 'AGENCY', requestedScopes: ['webhooks:manage'] });
    expect(denied.allowed).toBe(false);
    expect(denied.deniedScopes).toEqual(['webhooks:manage']);
  });

  it('redacts secret-like event metadata and detects unsafe guarantee copy', () => {
    const sanitized = sanitizeApiEventMetadata({ token: 'raw', harmless: 'ok', signedUrl: 'https://example.test/private' });
    expect(sanitized.token).toBe('[redacted]');
    expect(sanitized.signedUrl).toBe('[redacted]');
    expect(sanitized.harmless).toBe('ok');
    expect(apiCopyContainsUnsafeGuarantee('Guaranteed sales and ranking from this API workflow.')).toBe(true);
    expect(apiCopyContainsUnsafeGuarantee('This workflow does not guarantee marketplace approval or sales.')).toBe(false);
  });
});
