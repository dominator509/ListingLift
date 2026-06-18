import { NextResponse } from 'next/server';
import { reportApprovalInputSchema } from '@/schemas/reports-upsells';

export async function POST(request: Request, context: { params: Promise<{ reportId: string }> }) {
  const body = await request.json();
  const input = reportApprovalInputSchema.parse({ ...body, reportId: (await context.params).reportId });
  return NextResponse.json({ ...input, audited: true, persisted: false, dryRun: true });
}
