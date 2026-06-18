import { NextResponse } from 'next/server';
import { automationWebhookTestInputSchema } from '@/schemas/automation-webhooks';
import { dispatchAutomationWebhook } from '@/server/services/automation-dispatch-service';

export async function POST(request: Request) {
  const body = automationWebhookTestInputSchema.parse(await request.json());
  const result = await dispatchAutomationWebhook({
    organizationId: 'dry-run-org',
    providerKey: body.providerKey,
    triggerKey: body.triggerKey,
    actionKey: body.actionKey,
    dryRun: true,
    payload: { test: true, message: 'ListingLift automation test payload' },
  });
  return NextResponse.json({ ok: true, result, persistence: 'dry-run' });
}
