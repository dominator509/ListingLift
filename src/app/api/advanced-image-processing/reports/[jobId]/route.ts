import { NextResponse } from 'next/server';

import { buildAdvancedImageQualityReport } from '@/server/services/advanced-image-quality-report-service';

export async function POST(request: Request, context: { params: Promise<{ jobId: string }> }) {
  const params = await context.params;
  const body = await request.json();
  return NextResponse.json(buildAdvancedImageQualityReport({
    jobId: (await params).jobId,
    imageCount: body.imageCount ?? 0,
    approvedCount: body.approvedCount ?? 0,
    flaggedCount: body.flaggedCount ?? 0,
    failedCount: body.failedCount ?? 0,
    targetPlatforms: body.targetPlatforms ?? [],
  }));
}
