import { jsonOk } from '@/lib/api-response';

export async function GET(_request: Request, { params }: { params: Promise<{ invoiceId: string }> }) {
  return jsonOk({ invoiceId: (await params).invoiceId, note: 'Seed route. Codex must query invoice by tenant/client scope.' });
}
