import { describe, expect, it } from 'vitest';
import { SECURITY_CONTROL_CHECKLIST, isSafeSecurityCopy, redactSecurityMetadata } from '@/domain/security-hardening';

describe('security hardening domain', () => {
  it('maps all Phase 37 security controls to Codex-required scaffolds', () => {
    expect(SECURITY_CONTROL_CHECKLIST.length).toBeGreaterThanOrEqual(10);
    expect(SECURITY_CONTROL_CHECKLIST.some((control) => control.area === 'SECRET_STORAGE')).toBe(true);
    expect(SECURITY_CONTROL_CHECKLIST.some((control) => control.area === 'WEBHOOK_SIGNATURES')).toBe(true);
    expect(SECURITY_CONTROL_CHECKLIST.every((control) => control.codexRequired)).toBe(true);
  });

  it('redacts secret-bearing metadata keys', () => {
    const redacted = redactSecurityMetadata({ token: 'raw', safe: 'value', webhookSecret: 'raw' });
    expect(redacted.token).toBe('[redacted]');
    expect(redacted.webhookSecret).toBe('[redacted]');
    expect(redacted.safe).toBe('value');
  });

  it('rejects unsafe marketplace guarantee copy', () => {
    expect(isSafeSecurityCopy('Clean product image pack prepared for seller review.')).toBe(true);
    expect(isSafeSecurityCopy('Guaranteed Amazon ranking boost.')).toBe(false);
  });
});
