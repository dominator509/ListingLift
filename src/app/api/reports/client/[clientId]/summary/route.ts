import { NextResponse } from 'next/server';
import { reportBuildInputSchema } from '@/schemas/reports-upsells';
import { buildMonthlySellerReport } from '@/server/services/report-builder-service';

export async function POST(request: Request, context: { params: Promise<{ clientId: string }> }) {
  const body = await request.json();
  const input = reportBuildInputSchema.parse({ ...body, clientId: (await context.params).clientId, reportType: 'MONTHLY_CLEANUP' });
  return NextResponse.json(buildMonthlySellerReport(input));
}
