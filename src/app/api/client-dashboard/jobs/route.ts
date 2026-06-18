import { NextResponse } from 'next/server';
import { clientDashboardJobListRequestSchema } from '@/schemas/client-dashboard';
import { filterClientDashboardJobs, buildClientDashboardJobSummary } from '@/server/services/client-dashboard-job-service';

export async function POST(request: Request) {
  const body = clientDashboardJobListRequestSchema.parse(await request.json().catch(() => ({})));
  const jobs = filterClientDashboardJobs([], body);
  return NextResponse.json({ dryRun: true, jobs, summary: buildClientDashboardJobSummary(jobs), codexNote: 'Codex must query only active-client jobs and must never expose cross-client jobs.' });
}
