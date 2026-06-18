import { jsonOk } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { buildManualCreditAdjustmentDraft } from '@/server/services/credit-ledger-service';
import type { CreditAdjustmentInput } from '@/schemas/credits-subscriptions';

export async function POST(request: Request) {
  const body = await parseJson<Partial<CreditAdjustmentInput> & { organizationId?: string; previousBalance?: number }>(request, {});
  const draft = buildManualCreditAdjustmentDraft({ organizationId: body.organizationId ?? 'seed-org', clientId: body.clientId ?? 'seed-client', amount: body.amount ?? 1, reason: body.reason ?? 'GOODWILL_CREDIT', notes: body.notes, previousBalance: body.previousBalance ?? 0 });
  return jsonOk({ draft, note: 'Seed route. Codex must require adjust:credits/manage:billing and write an AuditLog.' }, { status: 201 });
}
