import { describe, expect, it } from 'vitest';
import { assertClientDashboardResourceAccess, evaluateClientDownloadGate, evaluateClientPreviewVisibility } from '@/server/services/client-dashboard-access-service';

describe('client dashboard access security', () => {
  it('blocks cross-tenant access', () => {
    expect(() => assertClientDashboardResourceAccess({ organizationId: 'org-a', userId: 'u1', clientId: 'client-a' }, { organizationId: 'org-b', clientId: 'client-a' })).toThrow(/Tenant scope/);
  });

  it('blocks non-approved preview outputs', () => {
    expect(evaluateClientPreviewVisibility({ visibility: 'CLIENT_VISIBLE', reviewStatus: 'APPROVED' }).visible).toBe(true);
    expect(evaluateClientPreviewVisibility({ visibility: 'CLIENT_VISIBLE', reviewStatus: 'APPROVED', flagged: true }).visible).toBe(false);
  });

  it('requires every download gate', () => {
    const gate = evaluateClientDownloadGate({ activeSession: true, clientScopeMatch: true, deliveryLinkValid: false, deliveryArchiveApproved: true, jobApproved: true, blockingQualityFlags: 0, downloadLimitExceeded: false });
    expect(gate.allowed).toBe(false);
    expect(gate.failedRequirements).toContain('delivery_link_valid');
  });
});
