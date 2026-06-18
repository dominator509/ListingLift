import { guardedGet } from '@/server/routes/route-helpers';

export async function GET(request: Request, context: { params: Promise<{ externalOrderId: string }> }) {
  const { externalOrderId } = await context.params;
  return guardedGet(request, 'manage:sales-channels', async () => ({
    id: externalOrderId,
    note: 'External order detail scaffold. Codex must load tenant-scoped order, client, job, revenue attribution, raw payload redaction, and audit events.',
  }));
}
