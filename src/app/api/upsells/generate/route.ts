import { NextResponse } from 'next/server';
import { upsellGenerateInputSchema } from '@/schemas/reports-upsells';
import { generateUpsellOfferDrafts } from '@/server/services/upsell-engine-service';

export async function POST(request: Request) {
  const body = await request.json();
  const input = upsellGenerateInputSchema.parse(body);
  return NextResponse.json({ offers: generateUpsellOfferDrafts(input), dryRun: true });
}
