import { NextResponse } from 'next/server';
import { buildAutomationDeadLetterDraft, planAutomationDeadLetterReplay } from '@/server/services/automation-dead-letter-service';

export async function GET() {
  return NextResponse.json({ ok: true, deadLetters: [], note: 'Codex must query failed delivery rows by organization.' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ok: true, draft: buildAutomationDeadLetterDraft(body), persistence: 'dry-run' }, { status: 202 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ok: true, plan: planAutomationDeadLetterReplay(body), persistence: 'dry-run' }, { status: 202 });
}
