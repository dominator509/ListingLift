export type CreditLedgerEntryType =
  | 'PURCHASE'
  | 'MANUAL_ADJUSTMENT'
  | 'JOB_DEBIT'
  | 'REVISION_DEBIT'
  | 'REFUND_REVERSAL'
  | 'SUBSCRIPTION_ALLOWANCE'
  | 'EXPIRATION'
  | 'IMPORT_CORRECTION';

export type CreditAdjustmentReason =
  | 'MANUAL_CREDIT_GRANT'
  | 'MANUAL_DEBIT_CORRECTION'
  | 'PAYMENT_CONFIRMED'
  | 'REFUND_OR_CHARGEBACK'
  | 'FULFILLMENT_USAGE'
  | 'SUBSCRIPTION_RESET'
  | 'GOODWILL_CREDIT'
  | 'MIGRATION_CORRECTION';

export type ManualInvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'VOID' | 'OVERDUE' | 'FAILED';
export type ManualPaymentConfirmationStatus = 'DRAFT' | 'CONFIRMED' | 'REJECTED' | 'REVERSED';
export type SubscriptionEntitlementStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED' | 'PENDING_PAYMENT';

export const CREDIT_LEDGER_ENTRY_TYPES: CreditLedgerEntryType[] = [
  'PURCHASE',
  'MANUAL_ADJUSTMENT',
  'JOB_DEBIT',
  'REVISION_DEBIT',
  'REFUND_REVERSAL',
  'SUBSCRIPTION_ALLOWANCE',
  'EXPIRATION',
  'IMPORT_CORRECTION',
];

export const CREDIT_ADJUSTMENT_REASONS: CreditAdjustmentReason[] = [
  'MANUAL_CREDIT_GRANT',
  'MANUAL_DEBIT_CORRECTION',
  'PAYMENT_CONFIRMED',
  'REFUND_OR_CHARGEBACK',
  'FULFILLMENT_USAGE',
  'SUBSCRIPTION_RESET',
  'GOODWILL_CREDIT',
  'MIGRATION_CORRECTION',
];

export const MANUAL_INVOICE_STATUSES: ManualInvoiceStatus[] = ['DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'VOID', 'OVERDUE', 'FAILED'];

export const SUBSCRIPTION_ENTITLEMENT_STATUSES: SubscriptionEntitlementStatus[] = ['ACTIVE', 'PAUSED', 'EXPIRED', 'CANCELLED', 'PENDING_PAYMENT'];

export const CREDIT_USAGE_SAFETY_COPY =
  'Credits represent internal ListingLift fulfillment allowance only. Credits do not guarantee marketplace approval, ranking, conversion, sales, ad performance, or product approval.';

export const MANUAL_INVOICE_SAFE_COPY =
  'Manual invoice confirmation must be performed by an authorized billing manager. Fulfillment access is granted only after server-side confirmation and audit logging.';

export function normalizeCreditAmount(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.trunc(value);
}

export function isCreditDebit(entryType: CreditLedgerEntryType, amount: number) {
  return amount < 0 || entryType === 'JOB_DEBIT' || entryType === 'REVISION_DEBIT' || entryType === 'EXPIRATION' || entryType === 'REFUND_REVERSAL';
}

export function calculateBalanceAfter(previousBalance: number, amount: number) {
  return Math.max(0, normalizeCreditAmount(previousBalance) + normalizeCreditAmount(amount));
}

export function canConsumeCredits(input: { available: number; requested: number; subscriptionStatus?: SubscriptionEntitlementStatus | null }) {
  if (input.subscriptionStatus && input.subscriptionStatus !== 'ACTIVE') return false;
  return normalizeCreditAmount(input.available) >= normalizeCreditAmount(input.requested) && normalizeCreditAmount(input.requested) > 0;
}

export function buildCreditLedgerReference(prefix: string, value: string | number = Date.now()) {
  return `${prefix}_${String(value).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48)}`;
}

export function evaluateManualInvoiceStatus(input: { status: ManualInvoiceStatus; paidCents: number; amountCents: number; dueAt?: string | Date | null }) {
  if (input.status === 'VOID') return 'VOID' satisfies ManualInvoiceStatus;
  if (input.paidCents >= input.amountCents && input.amountCents > 0) return 'PAID' satisfies ManualInvoiceStatus;
  if (input.paidCents > 0) return 'PARTIALLY_PAID' satisfies ManualInvoiceStatus;
  if (input.dueAt && new Date(input.dueAt).getTime() < Date.now()) return 'OVERDUE' satisfies ManualInvoiceStatus;
  return input.status;
}

export function redactManualPaymentReference(reference: string | null | undefined) {
  if (!reference) return '';
  const trimmed = reference.trim();
  if (trimmed.length <= 6) return '******';
  return `${trimmed.slice(0, 3)}…${trimmed.slice(-3)}`;
}

export function shouldGrantFulfillmentAccessFromManualInvoice(status: ManualInvoiceStatus) {
  return status === 'PAID' || status === 'PARTIALLY_PAID';
}
