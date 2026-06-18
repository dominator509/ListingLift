import { NextResponse } from 'next/server';
import { listAutomationWebhookPolicies } from '@/server/services/automation-webhook-policy-service';
import { listAutomationWebhookAdapters } from '@/server/adapters/automation-webhook/registry';

export async function GET() {
  return NextResponse.json({ ok: true, policies: listAutomationWebhookPolicies(), adapters: listAutomationWebhookAdapters() });
}
