import { jsonOk } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { buildManualInvoiceDraft } from '@/server/services/manual-invoice-service';
import type { ManualInvoiceCreateInput } from '@/schemas/credits-subscriptions';

export async function GET() {
  return jsonOk({ invoices: [], note: 'Seed route. Codex must query tenant-scoped ManualInvoice rows with pagination.' });
}

export async function POST(request: Request) {
  const body = await parseJson<Partial<ManualInvoiceCreateInput> & { organizationId?: string; createdByUserId?: string }>(request, {});
  const draft = buildManualInvoiceDraft({ organizationId: body.organizationId ?? 'seed-org', invoiceNumber: body.invoiceNumber ?? 'LLINV-SEED-0001', amountCents: body.amountCents ?? 9900, currency: body.currency ?? 'USD', creditsIncluded: body.creditsIncluded ?? 0, clientId: body.clientId, dueAt: body.dueAt, packageKey: body.packageKey, clientNotes: body.clientNotes, internalNotes: body.internalNotes, createdByUserId: body.createdByUserId });
  return jsonOk({ draft, note: 'Seed route. Codex must create ManualInvoice transactionally and audit invoice creation.' }, { status: 201 });
}
