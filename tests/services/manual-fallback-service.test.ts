import { describe, expect, it, vi } from 'vitest';
import { recordManualFallback } from '@/server/services/manual-fallback-service';

// Mock Prisma so the module can load without a real database
vi.mock('@/lib/prisma', () => ({
  prisma: {
    auditLog: {
      create: vi.fn().mockResolvedValue({ id: 'mock-audit-log-id' }),
    },
    $disconnect: vi.fn(),
  },
}));

describe('manual fallback service', () => {
  it('records audited manual fallback action drafts', async () => {
    const result = await recordManualFallback({
      organizationId: 'org_1',
      actorUserId: 'user_1',
      jobId: 'job_1',
      action: 'manual_final_delivery_approval',
      reason: 'Provider failed; operator approved manually edited ZIP.',
    });
    expect(result.action).toBe('manual_final_delivery_approval');
  });
});
