import { jsonOk } from '@/lib/api-response';
import { summarizeCreditLedger } from '@/server/services/credit-balance-service';

export async function GET() {
  const summary = summarizeCreditLedger([{ amount: 50 }, { amount: -10 }, { amount: 5 }]);
  return jsonOk({ summary, note: 'Seed route. Codex must query tenant-scoped CreditLedger rows and client scope server-side.' });
}
