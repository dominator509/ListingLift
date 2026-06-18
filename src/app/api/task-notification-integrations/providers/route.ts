import { NextResponse } from 'next/server';
import { listTaskNotificationProviders } from '@/server/services/task-notification-provider-service';
import { listTaskNotificationAdapters } from '@/server/adapters/task-notification/registry';

export async function GET() {
  return NextResponse.json({ ok: true, providers: listTaskNotificationProviders(), adapters: listTaskNotificationAdapters() });
}
