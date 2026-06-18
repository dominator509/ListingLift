import { describe, expect, it } from 'vitest';
import { buildClientWhereForSession, buildJobWhereForSession } from '@/server/services/client-access-service';
import { type SessionContext } from '@/schemas/auth';

const clientOwner: SessionContext = {
  userId: 'user_client',
  organizationId: 'org_1',
  role: 'CLIENT_OWNER',
  clientId: 'client_1',
};

describe('client access scope contracts', () => {
  it('scopes client role client queries to organization and client id', () => {
    expect(buildClientWhereForSession(clientOwner)).toEqual({ organizationId: 'org_1', id: 'client_1' });
  });

  it('scopes client role job queries to organization and client id', () => {
    expect(buildJobWhereForSession(clientOwner)).toEqual({ organizationId: 'org_1', clientId: 'client_1' });
  });

  it('scopes operator queries to organization only', () => {
    expect(buildClientWhereForSession({ ...clientOwner, role: 'OPERATOR', clientId: null })).toEqual({ organizationId: 'org_1' });
  });
});
