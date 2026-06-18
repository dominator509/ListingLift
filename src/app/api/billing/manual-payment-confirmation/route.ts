import { jsonOk } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { buildManualPaymentConfirmationDraft } from '@/server/services/manual-payment-confirmation-service';

export async function POST(request: Request) {
  const body = await parseJson<any>(request, {});
  const draft = buildManualPaymentConfirmationDraft({ organizationId: body.organizationId ?? 'seed-org', manualInvoiceId: body.manualInvoiceId ?? 'seed-invoice', amountCents: body.amountCents ?? 1, currency: body.currency ?? 'USD', paymentReference: body.paymentReference, notes: body.notes, confirmedByUserId: body.confirmedByUserId, applyCredits: body.applyCredits ?? true });
  return jsonOk({ draft, note: 'Seed route. Codex must never grant paid access without audited manual confirmation.' }, { status: 201 });
}
