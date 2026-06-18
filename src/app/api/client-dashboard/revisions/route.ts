import { NextResponse } from 'next/server';
import { clientDashboardRevisionRequestSchema } from '@/schemas/client-dashboard';
import { buildClientRevisionRequestDraft } from '@/server/services/client-dashboard-revision-service';

export async function POST(request: Request) {
  const body = clientDashboardRevisionRequestSchema.parse(await request.json());
  return NextResponse.json({
    dryRun: true,
    revision: buildClientRevisionRequestDraft({ organizationId: 'active-session-org', clientId: body.clientId, jobId: body.jobId, notes: body.notes, requestedOutputIds: body.requestedOutputIds }),
    codexNote: 'Codex must verify job/client/output scope, persist revision requests, update job status, and audit the mutation transactionally.',
  });
}
