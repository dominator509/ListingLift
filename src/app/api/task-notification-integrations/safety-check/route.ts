import { NextResponse } from 'next/server';
import { buildTaskNotificationSafetyReport } from '@/server/services/task-notification-safety-service';

export async function POST(request: Request) {
  return NextResponse.json({ ok: true, safety: buildTaskNotificationSafetyReport(await request.json()) });
}
