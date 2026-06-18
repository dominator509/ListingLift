import { describe, expect, it, vi } from 'vitest';

// Mock session resolution before route imports so requireSession returns a valid session
vi.mock('@/server/services/auth-session-service', () => ({
  requireSession: vi.fn().mockResolvedValue({
    userId: 'user_security',
    organizationId: 'org_security',
    role: 'SUPER_ADMIN',
  }),
}));

import { GET as getDashboard } from '@/app/api/admin/security/dashboard/route';
import { GET as getAuditMap } from '@/app/api/admin/security/audit-map/route';
import { POST as postUploadGuard } from '@/app/api/admin/security/upload-guard/route';

// Mock Prisma with a complete shape so it doesn't leak and break sibling tests
vi.mock('@/lib/prisma', () => ({
  prisma: {
    qaVerificationLedger: {
      create: vi.fn().mockResolvedValue({ id: 'mock-ledger-id' }),
      findMany: vi.fn().mockResolvedValue([]),
    },
    $disconnect: vi.fn(),
    $on: vi.fn(),
  },
}));

const headers = {
  'x-demo-user-id': 'user_security',
  'x-demo-organization-id': 'org_security',
  'x-demo-role': 'SUPER_ADMIN',
};

async function readJson(response: Response) {
  return response.json() as Promise<{ ok: boolean; data: unknown }>;
}

describe('phase37 security route contracts', () => {
  it('serves the admin security dashboard behind manage:security permission', async () => {
    const response = await getDashboard(new Request('http://localhost/api/admin/security/dashboard', { headers }));
    expect(response.status).toBe(200);
    const body = await readJson(response);
    expect(body.ok).toBe(true);
    expect(JSON.stringify(body.data)).toContain('"phase":37');
  });

  it('serves the audit completeness map', async () => {
    const response = await getAuditMap(new Request('http://localhost/api/admin/security/audit-map', { headers }));
    expect(response.status).toBe(200);
    const body = await readJson(response);
    expect(JSON.stringify(body.data)).toContain('WEBHOOK_REJECTED');
  });

  it('dry-runs unsafe upload rejection', async () => {
    const response = await postUploadGuard(new Request('http://localhost/api/admin/security/upload-guard', {
      method: 'POST',
      headers,
      body: JSON.stringify({ fileName: '../bad.exe', mimeType: 'application/x-msdownload', sizeBytes: 10, sourceSurface: 'PUBLIC_UPLOAD' }),
    }));
    expect(response.status).toBe(200);
    const body = await readJson(response);
    expect(JSON.stringify(body.data)).toContain('mime_not_allowlisted');
  });
});
