import { calculateBalanceAfter, buildCreditLedgerReference, isCreditDebit, type CreditLedgerEntryType } from '@/domain/credits-subscriptions';
import { creditLedgerEntryInputSchema, type CreditLedgerEntryInput, type CreditAdjustmentInput, creditAdjustmentInputSchema } from '@/schemas/credits-subscriptions';

export function buildCreditLedgerEntryDraft(input: CreditLedgerEntryInput) {
  const parsed = creditLedgerEntryInputSchema.parse(input);
  const entryType = parsed.entryType as CreditLedgerEntryType;
  const balanceAfter = calculateBalanceAfter(parsed.previousBalance, parsed.amount);
  return {
    organizationId: parsed.organizationId,
    clientId: parsed.clientId ?? null,
    jobId: parsed.jobId ?? null,
    amount: parsed.amount,
    balanceAfter,
    creditType: entryType,
    source: parsed.source,
    reason: parsed.reason,
    sourceReferenceType: parsed.sourceReferenceType ?? null,
    sourceReferenceId: parsed.sourceReferenceId ?? buildCreditLedgerReference(parsed.source, parsed.reason),
    notes: parsed.notes ?? null,
    debit: isCreditDebit(entryType, parsed.amount),
  };
}

export function buildManualCreditAdjustmentDraft(input: CreditAdjustmentInput & { organizationId: string; previousBalance?: number }) {
  const parsed = creditAdjustmentInputSchema.parse(input);
  return buildCreditLedgerEntryDraft({
    organizationId: input.organizationId,
    clientId: parsed.clientId,
    amount: parsed.amount,
    previousBalance: input.previousBalance ?? 0,
    entryType: 'MANUAL_ADJUSTMENT',
    reason: parsed.reason,
    source: 'manual_admin_adjustment',
    notes: parsed.notes,
  });
}

export function buildCreditUsageDraft(input: { organizationId: string; clientId: string; jobId: string; requestedCredits: number; previousBalance: number }) {
  return buildCreditLedgerEntryDraft({
    organizationId: input.organizationId,
    clientId: input.clientId,
    jobId: input.jobId,
    amount: -Math.abs(input.requestedCredits),
    previousBalance: input.previousBalance,
    entryType: 'JOB_DEBIT',
    reason: 'FULFILLMENT_USAGE',
    source: 'job_fulfillment',
    sourceReferenceType: 'Job',
    sourceReferenceId: input.jobId,
  });
}
