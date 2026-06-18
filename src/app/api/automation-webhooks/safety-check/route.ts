import { NextResponse } from 'next/server';
import { AUTOMATION_WEBHOOK_SECURITY_RULES, redactAutomationPayload } from '@/domain/automation-webhooks';
import { stripUnsafeAutomationPayloadKeys } from '@/server/services/automation-event-payload-service';

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ok: true, rules: AUTOMATION_WEBHOOK_SECURITY_RULES, safePayload: redactAutomationPayload(stripUnsafeAutomationPayloadKeys(body.payload ?? {})) });
}
