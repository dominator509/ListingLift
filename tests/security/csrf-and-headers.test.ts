import { describe, expect, it } from 'vitest';
import { buildSecurityHeaderEntries } from '@/lib/security-headers';
import { createCsrfTokenDraft, verifyCsrfTokenDraft } from '@/server/services/csrf-protection-service';
import { buildSafeOutputPreview } from '@/server/services/xss-output-protection-service';

describe('csrf, headers, and xss scaffolds', () => {
  it('emits baseline security headers including production HSTS', () => {
    const headers = Object.fromEntries(buildSecurityHeaderEntries('production'));
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['Strict-Transport-Security']).toContain('max-age=');
    expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
  });

  it('creates and verifies session-bound CSRF token drafts', () => {
    const csrfSecret = 'replace-with-real-32-character-csrf-secret';
    const issued = createCsrfTokenDraft({ sessionId: 'session_security_123', organizationId: 'org_security', csrfSecret, expiresInMinutes: 30 });
    const verified = verifyCsrfTokenDraft({ sessionId: 'session_security_123', organizationId: 'org_security', csrfSecret, token: issued.token });
    expect(verified.ok).toBe(true);
    expect(issued.rawTokenStored).toBe(false);
  });

  it('escapes rendered output and neutralizes CSV formula cells', () => {
    const safe = buildSafeOutputPreview('=Clean <script>alert(1)</script>');
    expect(safe.escapedHtml).toContain('&lt;script&gt;');
    expect(safe.csvSafe.startsWith("'")).toBe(true);
  });
});
