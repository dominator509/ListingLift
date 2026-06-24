import { describe, expect, it, vi } from 'vitest';

// Mock session resolution before route imports so requireSession returns a valid session
vi.mock('@/server/services/auth-session-service', () => ({
  requireSession: vi.fn().mockResolvedValue({
    userId: 'user_qa',
    organizationId: 'org_qa',
    role: 'SUPER_ADMIN',
  }),
}));

import { GET as getDashboard } from '@/app/api/admin/qa/dashboard/route';
import { GET as getRunbook } from '@/app/api/admin/qa/runbook/route';
import { GET as getLedger, POST as postLedger } from '@/app/api/admin/qa/verification-ledger/route';

// Mock Prisma so the route handlers can load without a real database
vi.mock('@/lib/prisma', () => ({
  prisma: {
    qaVerificationLedger: {
      create: vi.fn().mockResolvedValue({ id: 'mock-ledger-id' }),
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'mock-ledger-id',
          checkKey: 'build',
          phase: 38,
          layer: 'BUILD',
          status: 'PASS',
          severity: 'BLOCKER',
          accepted: true,
          evidenceCount: 1,
          evidenceRefs: [{ type: 'COMMAND_OUTPUT', ref: 'ROADMAP_STATUS.md#build' }],
          productionReleaseAllowed: false,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
        },
      ]),
    },
  },
}));

const headers = {
  'x-demo-user-id': 'user_qa',
  'x-demo-organization-id': 'org_qa',
  'x-demo-role': 'SUPER_ADMIN',
};

async function readJson(response: Response) {
  return response.json() as Promise<{ ok: boolean; data: unknown }>;
}

describe('phase38 full testing QA route contracts', () => {
  it('serves the QA dashboard behind manage:qa permission', async () => {
    const response = await getDashboard(new Request('http://localhost/api/admin/qa/dashboard', { headers }));
    expect(response.status).toBe(200);
    const body = await readJson(response);
    expect(body.ok).toBe(true);
    expect(JSON.stringify(body.data)).toContain('Phase 38');
    expect(JSON.stringify(body.data)).toContain('npm run test:e2e');
  });

  it('serves the Codex QA runbook', async () => {
    const response = await getRunbook(new Request('http://localhost/api/admin/qa/runbook', { headers }));
    expect(response.status).toBe(200);
    const body = await readJson(response);
    expect(JSON.stringify(body.data)).toContain('CODEX_GAPS.md');
  });

  it('rejects fake PASS ledger drafts without evidence', async () => {
    const response = await postLedger(new Request('http://localhost/api/admin/qa/verification-ledger', {
      method: 'POST',
      headers,
      body: JSON.stringify({ checkKey: 'build', layer: 'BUILD', status: 'PASS', severity: 'BLOCKER', command: 'npm run build', notes: 'build passed' }),
    }));
    expect(response.status).toBe(200);
    const body = await readJson(response);
    expect(JSON.stringify(body.data)).toContain('PASS status requires evidence');
    expect(JSON.stringify(body.data)).toContain('persisted');
  });

  it('serves persisted QA ledger records for the organization', async () => {
    const response = await getLedger(new Request('http://localhost/api/admin/qa/verification-ledger', { headers }));
    expect(response.status).toBe(200);
    const body = await readJson(response);
    expect(JSON.stringify(body.data)).toContain('mock-ledger-id');
    expect(JSON.stringify(body.data)).toContain('ROADMAP_STATUS.md#build');
    expect(JSON.stringify(body.data)).toContain('phase38-local-qa-evidence-storage');
    expect(JSON.stringify(body.data)).toContain('LOCAL_DATABASE_REFERENCES');
    expect(JSON.stringify(body.data)).toContain('phase38-local-qa-evidence-retention');
    expect(JSON.stringify(body.data)).toContain('manual_admin_purge_required');
    expect(JSON.stringify(body.data)).toContain('persisted');
  });
});
