import { jsonOk } from '@/lib/api-response';

export async function POST(_request: Request, { params }: { params: Promise<{ invoiceId: string }> }) {
  return jsonOk({ invoiceId: (await params).invoiceId, status: 'VOID', note: 'Seed route. Codex must void invoices transactionally and prevent credit/application side effects after void.' });
}
