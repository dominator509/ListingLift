import { jsonOk } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { buildCreditLedgerEntryDraft } from '@/server/services/credit-ledger-service';
import type { CreditLedgerEntryInput } from '@/schemas/credits-subscriptions';

export async function POST(request: Request) {
  const body = await parseJson<Partial<CreditLedgerEntryInput>>(request, {});
  const draft = buildCreditLedgerEntryDraft({ organizationId: body.organizationId ?? 'seed-org', amount: body.amount ?? 0, previousBalance: body.previousBalance ?? 0, reason: body.reason ?? 'MANUAL_CREDIT_GRANT', entryType: body.entryType ?? 'MANUAL_ADJUSTMENT', source: body.source ?? 'seed' });
  return jsonOk({ draft, note: 'Seed route. Codex must persist CreditLedger transactionally and audit changes.' }, { status: 201 });
}
