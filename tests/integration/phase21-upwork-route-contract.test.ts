import { describe, expect, it } from 'vitest';
import { createUpworkManualContractPlan } from '@/server/services/upwork-contract-intake-service';
import { listDefaultUpworkOfferMappings } from '@/server/services/upwork-package-mapping-service';

describe('phase 21 upwork route contract', () => {
  it('keeps route implementation dry-run until Codex wires Prisma transactions', () => {
    const plan = createUpworkManualContractPlan({ contractId: 'up-contract-1', clientName: 'Client', contractTitle: 'Marketplace image pack', contractType: 'FIXED_PRICE', milestoneStatus: 'ACTIVE', billedAmount: 500, hourlyRate: 25, currency: 'USD', uploadStatus: 'WAITING_FOR_UPLOAD', dryRun: true });
    expect(plan.mode).toBe('DRY_RUN');
    expect(plan.externalOrderDraft.normalized.channelName).toBe('Upwork');
  });

  it('has organization-scoped mappings to persist later', () => {
    expect(listDefaultUpworkOfferMappings().length).toBeGreaterThanOrEqual(5);
  });
});
