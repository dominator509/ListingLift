import { describe, expect, it, vi } from 'vitest';
import { normalizeEmail, assertPasswordPolicy, hashPassword, verifyPassword, redactUserForAuth } from '../../src/server/auth/password';
import { createSessionToken, sessionExpiresAt } from '../../src/server/auth/session-cookie';
import { createOpaqueToken, hashToken, safeTokenPreview } from '../../src/lib/tokens';

describe('password policy — edge cases', () => {
  it('rejects empty password', () => {
    expect(() => assertPasswordPolicy('')).toThrow('at least 12');
  });

  it('rejects exactly 11 characters (below minimum)', () => {
    expect(() => assertPasswordPolicy('Pass1234wor')).toThrow('at least 12');
  });

  it('accepts exactly 12 characters with 3 character classes', () => {
    expect(() => assertPasswordPolicy('Pass1234word!')).not.toThrow();
  });

  it('rejects letters-only password regardless of length', () => {
    expect(() => assertPasswordPolicy('abcdefghijklm')).toThrow('at least 3 of: uppercase, lowercase, digit, special character');
  });

  it('rejects numbers-only password regardless of length', () => {
    expect(() => assertPasswordPolicy('123456789012')).toThrow('at least 3 of: uppercase, lowercase, digit, special character');
  });

  it('rejects symbols-only password', () => {
    expect(() => assertPasswordPolicy('!@#$%^&*()!@#')).toThrow('at least 3 of: uppercase, lowercase, digit, special character');
  });

  it('rejects password with only 2 character classes (lowercase + digits)', () => {
    expect(() => assertPasswordPolicy('lowercase12345')).toThrow('at least 3 of: uppercase, lowercase, digit, special character');
  });

  it('accepts password with mixed case, numbers, and symbols (4 classes)', () => {
    expect(() => assertPasswordPolicy('Str0ng!Pass12')).not.toThrow();
  });

  it('accepts password with exactly 3 character classes (upper, lower, digit)', () => {
    expect(() => assertPasswordPolicy('Upp3rLow3rCase')).not.toThrow();
  });

  it('accepts password with exactly 3 character classes (upper, lower, special)', () => {
    expect(() => assertPasswordPolicy('Upp3rLow3r!!')).not.toThrow();
  });

  it('accepts unicode characters with 3 character classes', () => {
    expect(() => assertPasswordPolicy('Pässw0rdÜnicod!')).not.toThrow();
  });

  it('accepts leading/trailing whitespace in policy check', () => {
    expect(() => assertPasswordPolicy('  Pass1234word!  ')).not.toThrow();
  });
});

describe('normalizeEmail — edge cases', () => {
  it('handles null-like inputs gracefully', () => {
    expect(() => (normalizeEmail as (e: string) => string)(null as unknown as string)).toThrow();
  });

  it('handles empty string', () => {
    expect(normalizeEmail('')).toBe('');
  });

  it('trims and lowers with plus addressing', () => {
    expect(normalizeEmail('  User+tag@Example.COM ')).toBe('user+tag@example.com');
  });

  it('preserves dots in local part', () => {
    expect(normalizeEmail('john.doe@GMAIL.COM')).toBe('john.doe@gmail.com');
  });

  it('handles single character email', () => {
    const result = normalizeEmail('a@b.co');
    expect(result).toBe('a@b.co');
  });
});

describe('hashPassword / verifyPassword — contract', () => {
  it('hashes and verifies a valid password', async () => {
    const hash = await hashPassword('ValidPass123!');
    expect(hash).toBeTruthy();
    expect(hash).not.toContain('ValidPass123!');
    const verified = await verifyPassword('ValidPass123!', hash);
    expect(verified).toBe(true);
  });

  it('rejects wrong password after hashing', async () => {
    const hash = await hashPassword('CorrectP4ssWord!');
    const verified = await verifyPassword('WrongP4ssWord!', hash);
    expect(verified).toBe(false);
  });

  it('returns false when passwordHash is null', async () => {
    const verified = await verifyPassword('AnyPass123!', null);
    expect(verified).toBe(false);
  });

  it('returns false when passwordHash is undefined', async () => {
    const verified = await verifyPassword('AnyPass123!', undefined);
    expect(verified).toBe(false);
  });

  it('returns false when passwordHash is empty string', async () => {
    const verified = await verifyPassword('AnyPass123!', '');
    expect(verified).toBe(false);
  });

  it('rejects empty password to hashPassword', async () => {
    await expect(hashPassword('')).rejects.toThrow('at least 12');
  });

  it('rejects short password to hashPassword', async () => {
    await expect(hashPassword('Short12')).rejects.toThrow('at least 12');
  });

  it('produces different hashes for same password (different salt)', async () => {
    const hash1 = await hashPassword('SameP4ssWord!');
    const hash2 = await hashPassword('SameP4ssWord!');
    expect(hash1).not.toBe(hash2);
  });
});

describe('redactUserForAuth — edge cases', () => {
  it('removes passwordHash from full user object', () => {
    const result = redactUserForAuth({ id: 'u1', email: 'a@b.com', name: 'Test', passwordHash: 'secret' });
    expect(result).toEqual({ id: 'u1', email: 'a@b.com', name: 'Test' });
    expect('passwordHash' in result).toBe(false);
  });

  it('handles null passwordHash', () => {
    const result = redactUserForAuth({ id: 'u1', email: 'a@b.com', passwordHash: null });
    expect(result).toEqual({ id: 'u1', email: 'a@b.com' });
  });

  it('handles undefined passwordHash', () => {
    const result = redactUserForAuth({ id: 'u1', email: 'a@b.com' });
    expect(result).toEqual({ id: 'u1', email: 'a@b.com' });
  });

  it('preserves all other fields', () => {
    const result = redactUserForAuth({ id: 'u1', email: 'a@b.com', name: 'Test', role: 'ADMIN', passwordHash: 'hash' });
    expect(result).toEqual({ id: 'u1', email: 'a@b.com', name: 'Test', role: 'ADMIN' });
  });
});

describe('session token generation — createSessionToken', () => {
  it('returns token and tokenHash pair', () => {
    const result = createSessionToken();
    expect(result.token).toBeTruthy();
    expect(result.tokenHash).toBeTruthy();
    expect(result.token.length).toBeGreaterThan(0);
    expect(result.tokenHash.length).toBe(64);
  });

  it('generates unique tokens each call', () => {
    const a = createSessionToken();
    const b = createSessionToken();
    expect(a.token).not.toBe(b.token);
  });

  it('token hash is valid SHA-256 hex', () => {
    const result = createSessionToken();
    expect(result.tokenHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('hashToken matches createSessionToken hash', () => {
    const { token, tokenHash } = createSessionToken();
    expect(hashToken(token)).toBe(tokenHash);
  });
});

describe('sessionExpiresAt — boundary values', () => {
  it('returns a date in the future by default', () => {
    const expires = sessionExpiresAt();
    expect(expires.getTime()).toBeGreaterThan(Date.now());
  });

  it('returns exactly SESSION_TTL_SECONDS from now', () => {
    const now = new Date('2026-06-01T00:00:00Z');
    const expires = sessionExpiresAt(now);
    const diffMs = expires.getTime() - now.getTime();
    expect(diffMs).toBe(14 * 24 * 60 * 60 * 1000);
  });
});

describe('createOpaqueToken — edge cases', () => {
  it('generates tokens of varying byte lengths', () => {
    expect(createOpaqueToken(16).length).toBeGreaterThan(0);
    expect(createOpaqueToken(64).length).toBeGreaterThan(0);
  });

  it('produces unique tokens', () => {
    const tokens = new Set(Array.from({ length: 100 }, () => createOpaqueToken(32)));
    expect(tokens.size).toBe(100);
  });
});

describe('safeTokenPreview — privacy', () => {
  it('redacts short tokens', () => {
    expect(safeTokenPreview('short')).toBe('[redacted]');
    expect(safeTokenPreview('12345678')).toBe('[redacted]');
  });

  it('shows first 4 and last 4 chars for longer tokens', () => {
    const token = 'abcdefghijklmnopqrstuvwxyz';
    expect(safeTokenPreview(token)).toBe('abcd…wxyz');
  });

  it('never leaks full token', () => {
    const token = createOpaqueToken(32);
    const preview = safeTokenPreview(token);
    expect(preview).not.toBe(token);
    expect(preview).toContain('…');
  });
});
