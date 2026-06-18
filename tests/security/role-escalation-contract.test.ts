import { describe, expect, it } from 'vitest';
import { assertCanManageRole, getAssignableRoles } from '@/server/services/team-service';
import { type SessionContext } from '@/schemas/auth';

const agencyAdmin: SessionContext = { userId: 'u1', organizationId: 'org1', role: 'AGENCY_ADMIN', agencyScope: true };

describe('role escalation prevention', () => {
  it('prevents non-super-admins from assigning equal or higher roles', () => {
    expect(() => assertCanManageRole(agencyAdmin, 'SUPER_ADMIN')).toThrow(/cannot assign/);
    expect(() => assertCanManageRole(agencyAdmin, 'AGENCY_ADMIN')).toThrow(/cannot assign/);
  });

  it('allows lower role assignment for managers with manage team permission', () => {
    expect(() => assertCanManageRole(agencyAdmin, 'CLIENT_VIEWER')).not.toThrow();
  });

  it('filters assignable roles based on actor rank', () => {
    const roles = getAssignableRoles(agencyAdmin).map((role) => role.key);
    expect(roles).toContain('CLIENT_VIEWER');
    expect(roles).not.toContain('SUPER_ADMIN');
    expect(roles).not.toContain('AGENCY_ADMIN');
  });
});
