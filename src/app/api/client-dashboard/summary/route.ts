import { NextResponse } from 'next/server';
import { clientDashboardSummaryRequestSchema } from '@/schemas/client-dashboard';
import { buildClientDashboardSummary } from '@/server/services/client-dashboard-summary-service';

export async function POST(request: Request) {
  const body = clientDashboardSummaryRequestSchema.parse(await request.json().catch(() => ({})));
  return NextResponse.json({
    dryRun: true,
    summary: buildClientDashboardSummary({ clientId: body.clientId, creditsRemaining: 25, creditsTotal: 50, activeJobs: 1, completedJobs: 1, readyDownloads: 1 }),
    codexNote: 'Codex must load summary counts from tenant-scoped Prisma queries for the active client membership.',
  });
}
