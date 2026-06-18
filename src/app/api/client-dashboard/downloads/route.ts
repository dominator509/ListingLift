import { NextResponse } from 'next/server';
import { clientDashboardDownloadRequestSchema } from '@/schemas/client-dashboard';
import { buildClientDownloadCard } from '@/server/services/client-dashboard-download-service';

export async function POST(request: Request) {
  const body = clientDashboardDownloadRequestSchema.parse(await request.json().catch(() => ({})));
  return NextResponse.json({
    dryRun: true,
    download: buildClientDownloadCard({ jobId: body.jobId ?? 'dry-run-job', title: 'Dry-run delivery archive', deliveryArchiveApproved: false, jobApproved: false, deliveryLinkValid: false }),
    codexNote: 'Codex must resolve delivery tokens by hash and enforce approval, archive, client, and download-count gates before streaming files.',
  });
}
