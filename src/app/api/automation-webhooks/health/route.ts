import { NextResponse } from 'next/server';
import { buildAutomationHealthSummary } from '@/server/services/automation-health-service';

export async function GET() {
  return NextResponse.json({ ok: true, health: await buildAutomationHealthSummary() });
}
