import { NextResponse } from 'next/server';
import { buildTaskNotificationHealthSummary } from '@/server/services/task-notification-health-service';

export async function GET() {
  return NextResponse.json({ ok: true, health: await buildTaskNotificationHealthSummary() });
}
