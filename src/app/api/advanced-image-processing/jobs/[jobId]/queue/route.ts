import { NextResponse } from 'next/server';

import { queueAdvancedImageProcessing } from '@/server/services/advanced-image-orchestrator';

export async function POST(request: Request, context: { params: Promise<{ jobId: string }> }) {
  const params = await context.params;
  const body = await request.json();
  const result = await queueAdvancedImageProcessing({ ...body, jobId: (await params).jobId, dryRun: body.dryRun ?? true });
  return NextResponse.json({ ...result, routeContract: 'Codex must replace this dry-run queue plan with tenant-scoped Prisma/storage/provider transactions.' });
}
