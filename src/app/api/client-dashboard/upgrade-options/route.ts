import { NextResponse } from 'next/server';
import { recommendClientDashboardUpgrades } from '@/server/services/client-dashboard-upgrade-service';

export async function GET() {
  return NextResponse.json({
    dryRun: true,
    recommendations: recommendClientDashboardUpgrades({ completedJobs: 3, monthlyImages: 40, creditsRemaining: 3 }),
    codexNote: 'Codex must load upsell opportunities server-side and keep recommendations as manual-review drafts.',
  });
}
