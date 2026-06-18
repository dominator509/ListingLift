import { NextResponse } from 'next/server';
import { upsellStatusUpdateSchema } from '@/schemas/reports-upsells';

export async function POST(request: Request, context: { params: Promise<{ upsellOfferId: string }> }) {
  const body = await request.json();
  const input = upsellStatusUpdateSchema.parse({ ...body, upsellOfferId: (await context.params).upsellOfferId });
  return NextResponse.json({ ...input, audited: true, persisted: false, dryRun: true });
}
