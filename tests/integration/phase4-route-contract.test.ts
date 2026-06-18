import { describe, expect, it, vi } from 'vitest';

// Mock session resolution before route imports so requireSession returns a valid session
vi.mock('@/server/services/auth-session-service', () => ({
  requireSession: vi.fn().mockResolvedValue({
    userId: 'u1',
    organizationId: 'org1',
    role: 'SUPER_ADMIN',
    organizationType: 'AGENCY',
  }),
}));

vi.mock('@/server/services/team-service', () => ({
  getAssignableRoles: vi.fn().mockReturnValue([]),
}));

vi.mock('@/server/services/agency-service', () => ({
  buildAgencyClientWhere: vi.fn().mockReturnValue({}),
}));

import { GET as getRoles } from '@/app/api/rbac/roles/route';
import { GET as getAgencyClients } from '@/app/api/agency/clients/route';

// Mock Prisma so the route handlers can load without a real database
vi.mock('@/lib/prisma', () => ({ prisma: {} }));

function requestWithHeaders(url: string, headers: Record<string, string>) {
  return new Request(url, { headers });
}

describe('Phase 4 route contracts', () => {
  it('returns assignable roles through a session-aware route', async () => {
    const response = await getRoles(
      requestWithHeaders('https://listinglift.test/api/rbac/roles', {
        'x-demo-user-id': 'u1',
        'x-demo-organization-id': 'org1',
        'x-demo-role': 'SUPER_ADMIN',
      }),
    );
    expect(response.status).toBe(200);
  });

  it('allows agency clients route for agency-scoped demo sessions', async () => {
    const response = await getAgencyClients(
      requestWithHeaders('https://listinglift.test/api/agency/clients', {
        'x-demo-user-id': 'u1',
        'x-demo-organization-id': 'org1',
        'x-demo-role': 'AGENCY_ADMIN',
        'x-demo-agency-scope': 'true',
        'x-demo-organization-type': 'AGENCY',
      }),
    );
    expect(response.status).toBe(200);
  });
});
