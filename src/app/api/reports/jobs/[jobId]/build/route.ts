import { NextResponse } from 'next/server';
import { reportBuildInputSchema } from '@/schemas/reports-upsells';
import { buildReportDraft } from '@/server/services/report-builder-service';

export async function POST(request: Request, context: { params: Promise<{ jobId: string }> }) {
  const body = await request.json();
  const input = reportBuildInputSchema.parse({ ...body, jobId: (await context.params).jobId });
  return NextResponse.json(buildReportDraft(input));
}
