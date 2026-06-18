import { NextResponse } from 'next/server';

import { planAdvancedImageProcessing } from '@/server/services/advanced-image-orchestrator';

export async function POST(request: Request) {
  const body = await request.json();
  const result = await planAdvancedImageProcessing(body);
  return NextResponse.json({ ...result, dryRun: true });
}
