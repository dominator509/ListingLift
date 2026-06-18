import { NextResponse } from 'next/server';
import { planReportExport } from '@/server/services/report-export-service';

export async function POST(request: Request, context: { params: Promise<{ reportId: string }> }) {
  const body = await request.json();
  return NextResponse.json(planReportExport({ ...body, reportId: (await context.params).reportId }));
}
