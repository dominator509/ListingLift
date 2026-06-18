import { NextResponse } from 'next/server';
import { reportAudiences, reportTypeKeys, reportMetricKinds } from '@/domain/reports-upsells';

export async function GET() {
  return NextResponse.json({ reportTypeKeys, reportAudiences, reportMetricKinds, dryRun: true });
}
