import { NextResponse } from 'next/server';

import { runAdvancedImageSafetyCheck } from '@/server/services/advanced-image-safety-service';

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(runAdvancedImageSafetyCheck(body));
}
