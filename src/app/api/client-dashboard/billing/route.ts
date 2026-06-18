import { NextResponse } from 'next/server';
import { buildClientDashboardSummary } from '@/server/services/client-dashboard-summary-service';

export async function GET() {
  return NextResponse.json({
    dryRun: true,
    billing: buildClientDashboardSummary({ creditsRemaining: 0, creditsTotal: 0 }).billing,
    codexNote: 'Codex must derive billing from verified CreditLedger, SubscriptionEntitlement, ManualInvoice, Stripe, and Gumroad records.',
  });
}
