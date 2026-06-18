import { NextResponse } from 'next/server';
import { inspectUpsellCopy } from '@/server/services/report-upsell-safety-service';

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(inspectUpsellCopy(String(body.copy ?? '')));
}
