import { describe, expect, it } from 'vitest';
import { buildCreditLedgerEntryDraft, buildCreditUsageDraft } from '@/server/services/credit-ledger-service';

describe('credit ledger service', () => {
  it('calculates balance after positive credit adjustment', () => {
    const draft = buildCreditLedgerEntryDraft({ organizationId: 'org', amount: 10, previousBalance: 5, reason: 'GOODWILL_CREDIT', entryType: 'MANUAL_ADJUSTMENT', source: 'test' });
    expect(draft.balanceAfter).toBe(15);
  });

  it('marks job credit usage as a debit and does not go negative', () => {
    const draft = buildCreditUsageDraft({ organizationId: 'org', clientId: 'client', jobId: 'job', requestedCredits: 20, previousBalance: 10 });
    expect(draft.debit).toBe(true);
    expect(draft.balanceAfter).toBe(0);
  });
});
