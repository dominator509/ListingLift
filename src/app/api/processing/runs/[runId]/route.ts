import { guardedGet } from '@/server/routes/route-helpers';

export async function GET(request: Request, { params }: { params: Promise<{ runId: string }> }) {
  return guardedGet(request, 'manage:jobs', async () => ({
    runId: (await params).runId,
    status: 'PLANNED',
    note: 'Codex must wire this to ImageProcessingRun with tenant-scoped Prisma query and step/error/output includes.',
  }));
}
