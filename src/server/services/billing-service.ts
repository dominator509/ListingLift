import { creditAdjustmentSchema, invoicePaymentSchema, type CreditAdjustmentInput, type InvoicePaymentInput } from '@/schemas/billing';

export function createCreditAdjustmentDraft(input: CreditAdjustmentInput) {
  const data = creditAdjustmentSchema.parse(input);
  return { ...data, createdAt: new Date().toISOString() };
}

export function createInvoicePaymentDraft(input: InvoicePaymentInput) {
  return invoicePaymentSchema.parse(input);
}
