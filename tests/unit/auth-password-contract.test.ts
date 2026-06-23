import { describe, expect, it } from 'vitest';
import { normalizeEmail, assertPasswordPolicy, redactUserForAuth } from '../../src/server/auth/password';

describe('phase 3 auth password contract', () => {
  it('normalizes email before lookup', () => {
    expect(normalizeEmail('  Dom@Example.COM ')).toBe('dom@example.com');
  });

  it('requires a minimally useful password policy', () => {
    expect(() => assertPasswordPolicy('short')).toThrow('at least 12');
    expect(() => assertPasswordPolicy('onlylettersonly')).toThrow('at least 3 of');
    expect(() => assertPasswordPolicy('Password123!')).not.toThrow();
  });

  it('redacts passwordHash from returned user objects', () => {
    expect(redactUserForAuth({ id: 'u1', email: 'a@example.com', passwordHash: 'hash' })).toEqual({ id: 'u1', email: 'a@example.com' });
  });
});
