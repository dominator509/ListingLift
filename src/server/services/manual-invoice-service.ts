import { MANUAL_INVOICE_SAFE_COPY, evaluateManualInvoiceStatus } from '@/domain/credits-subscriptions';
import { manualInvoiceCreateSchema, type ManualInvoiceCreateInput } from '@/schemas/credits-subscriptions';

export function buildManualInvoiceDraft(input: ManualInvoiceCreateInput & { organizationId: string; createdByUserId?: string }) {
  const parsed = manualInvoiceCreateSchema.parse(input);
  return {
    organizationId: input.organizationId,
    clientId: parsed.clientId ?? null,
    invoiceNumber: parsed.invoiceNumber,
    status: 'DRAFT' as const,
    amountCents: parsed.amountCents,
    paidCents: 0,
    currency: parsed.currency.toUpperCase(),
    creditsIncluded: parsed.creditsIncluded,
    packageKey: parsed.packageKey ?? null,
    dueAt: parsed.dueAt ? new Date(parsed.dueAt) : null,
    clientNotes: parsed.clientNotes ?? MANUAL_INVOICE_SAFE_COPY,
    internalNotes: parsed.internalNotes ?? null,
    createdByUserId: input.createdByUserId ?? null,
  };
}

export function evaluateManualInvoiceAccess(input: { status: 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'VOID' | 'OVERDUE' | 'FAILED'; amountCents: number; paidCents: number; dueAt?: string | Date | null }) {
  const status = evaluateManualInvoiceStatus(input);
  return {
    status,
    grantsAccess: status === 'PAID' || status === 'PARTIALLY_PAID',
    paymentRequiredCents: Math.max(0, input.amountCents - input.paidCents),
  };
}

export function buildManualInvoiceNumber(input: { prefix?: string; clientSlug?: string; entropy?: string | number }) {
  const prefix = input.prefix ?? 'LLINV';
  const client = (input.clientSlug ?? 'client').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16).toUpperCase();
  const entropy = String(input.entropy ?? Date.now()).replace(/[^a-zA-Z0-9]/g, '').slice(-8);
  return `${prefix}-${client}-${entropy}`;
}
