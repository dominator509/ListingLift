import { describe, expect, it } from 'vitest';
import { checkAuthRateLimit, clearAuthRateLimit, getRateLimitKey } from '../../src/server/auth/rate-limit';

describe('phase 3 auth rate-limit contract', () => {
  it('blocks login attempts after the configured threshold', () => {
    const key = getRateLimitKey('seller@example.com', '127.0.0.1');
    clearAuthRateLimit(key);
    expect(checkAuthRateLimit(key, 0, 2, 1000).allowed).toBe(true);
    expect(checkAuthRateLimit(key, 1, 2, 1000).allowed).toBe(true);
    expect(checkAuthRateLimit(key, 2, 2, 1000).allowed).toBe(false);
  });
});
