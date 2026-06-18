import { NextResponse } from 'next/server';
import { dispatchAutomationWebhook } from '@/server/services/automation-dispatch-service';
import { checkAutomationRateLimit } from '@/server/services/automation-rate-limit-service';

export async function POST(request: Request) {
  const body = await request.json();
  const rate = checkAutomationRateLimit({ key: `automation-dispatch:${body.organizationId ?? 'unknown'}` });
  if (!rate.allowed) return NextResponse.json({ ok: false, error: 'Rate limit exceeded for automation dispatch.' }, { status: 429 });
  const result = await dispatchAutomationWebhook({ ...body, dryRun: body.dryRun ?? true });
  return NextResponse.json({ ok: true, result, persistence: 'dry-run' }, { status: 202 });
}
