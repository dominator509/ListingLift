import { jsonOk } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { buildManualPaymentConfirmationDraft, evaluateManualPaymentConfirmation } from '@/server/services/manual-payment-confirmation-service';
import type { ManualPaymentConfirmationInput } from '@/schemas/credits-subscriptions';

export async function POST(request: Request, { params }: { params: Promise<{ invoiceId: string }> }) {
  const body = await parseJson<Partial<ManualPaymentConfirmationInput> & { organizationId?: string; confirmedByUserId?: string; invoiceAmountCents?: number; existingPaidCents?: number; invoiceStatus?: string }>(request, {});
  const evaluation = evaluateManualPaymentConfirmation({ invoiceAmountCents: body.invoiceAmountCents ?? body.amountCents ?? 0, existingPaidCents: body.existingPaidCents ?? 0, confirmationAmountCents: body.amountCents ?? 0, invoiceStatus: body.invoiceStatus ?? 'SENT' });
  const draft = buildManualPaymentConfirmationDraft({ organizationId: body.organizationId ?? 'seed-org', manualInvoiceId: body.manualInvoiceId ?? (await params).invoiceId, amountCents: body.amountCents ?? 1, currency: body.currency ?? 'USD', paymentReference: body.paymentReference, notes: body.notes, confirmedByUserId: body.confirmedByUserId, confirmedAt: body.confirmedAt, applyCredits: body.applyCredits ?? true });
  return jsonOk({ evaluation, draft, note: 'Seed route. Codex must require billing permission, persist payment confirmation, update invoice, apply credits if applicable, and audit.' }, { status: 201 });
}
