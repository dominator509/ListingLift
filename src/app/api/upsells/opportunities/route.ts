import { NextResponse } from 'next/server';
import { upsellSignalInputSchema } from '@/schemas/reports-upsells';
import { detectUpsellOpportunities } from '@/server/services/upsell-opportunity-service';

export async function POST(request: Request) {
  const body = await request.json();
  const signal = upsellSignalInputSchema.parse(body);
  return NextResponse.json({ opportunities: detectUpsellOpportunities(signal), dryRun: true });
}
