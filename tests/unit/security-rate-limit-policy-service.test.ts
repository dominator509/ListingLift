import { describe, expect, it } from 'vitest';
import { evaluateSecurityRateLimit, buildSecurityRateLimitSubjectHash } from '@/server/services/security-rate-limit-policy-service';

describe('security rate limit policy service', () => {
  it('builds stable redacted subject hashes', () => {
    const a = buildSecurityRateLimitSubjectHash('auth.login', { email: 'seller@example.com', ip: '127.0.0.1' });
    const b = buildSecurityRateLimitSubjectHash('auth.login', { ip: '127.0.0.1', email: 'seller@example.com' });
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  it('blocks requests over the scaffolded policy limit', () => {
    const result = evaluateSecurityRateLimit({ action: 'auth.login', subjectParts: { email: 'seller@example.com' }, observedCount: 5 });
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });
});
