import { NextResponse } from 'next/server';
import { listUpsellTemplates } from '@/server/services/upsell-template-service';

export async function GET() {
  return NextResponse.json({ templates: listUpsellTemplates(), dryRun: true });
}
