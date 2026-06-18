import { describe, expect, it } from 'vitest';
import { canAccessAgencyWhiteLabel, assertAgencyWhiteLabelAccess, assertCanManageAgencyBranding } from '@/server/services/agency-white-label-access-service';

const agencyAdmin = { organizationId: 'org-agency', userId: 'u1', role: 'AGENCY_ADMIN' as const, agencyScope: true, organizationType: 'AGENCY' as const };

describe('agency white-label access', () => {
  it('allows agency admins and super admins with valid scope', () => {
    expect(canAccessAgencyWhiteLabel(agencyAdmin)).toBe(true);
    expect(assertAgencyWhiteLabelAccess(agencyAdmin, { organizationId: 'org-agency' })).toBe(true);
    expect(canAccessAgencyWhiteLabel({ organizationId: 'platform', userId: 'super', role: 'SUPER_ADMIN' })).toBe(true);
  });

  it('blocks non-agency and cross-tenant access', () => {
    expect(canAccessAgencyWhiteLabel({ organizationId: 'org-client', userId: 'client', role: 'CLIENT_OWNER', clientId: 'client-1' })).toBe(false);
    expect(() => assertAgencyWhiteLabelAccess(agencyAdmin, { organizationId: 'other-org' })).toThrow(/tenant scope/);
  });

  it('requires manage agency branding permission for brand settings', () => {
    expect(assertCanManageAgencyBranding(agencyAdmin, { organizationId: 'org-agency' })).toBe(true);
    expect(() => assertCanManageAgencyBranding({ organizationId: 'org-agency', userId: 'viewer', role: 'CLIENT_VIEWER', clientId: 'client-1' }, { organizationId: 'org-agency' })).toThrow(/agency white-label access/);
  });
});
