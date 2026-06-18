import { describe, expect, it } from 'vitest';
import { buildRetainerOpportunityAlerts, buildRevenueAnalyticsSnapshot, detectMarketplaceToDirectConversionCandidates } from '@/server/services/admin-revenue-analytics-service';

describe('admin revenue analytics service', () => {
  it('calculates gross, refund, net, average order, and conversion metrics', () => {
    const snapshot = buildRevenueAnalyticsSnapshot([
      { channelKey: 'Fiverr', channelName: 'Fiverr', orderCount: 2, jobCount: 2, completedJobCount: 2, grossRevenueCents: 20000, refundCents: 5000, directConversionCount: 1 },
    ]);
    expect(snapshot.totals.grossRevenueCents).toBe(20000);
    expect(snapshot.totals.netRevenueCents).toBe(15000);
    expect(snapshot.totals.averageOrderValueCents).toBe(7500);
    expect(snapshot.totals.conversionRatePercent).toBe(50);
  });

  it('keeps marketplace-to-direct candidates manual-review only', () => {
    const candidates = detectMarketplaceToDirectConversionCandidates([
      { clientName: 'Seller A', marketplaceSource: 'Etsy', directSource: 'Direct', marketplaceOrderCount: 2, directOrderCount: 1, grossRevenueCents: 12000 },
      { clientName: 'Seller B', marketplaceSource: 'Fiverr', marketplaceOrderCount: 2, directOrderCount: 0, grossRevenueCents: 8000 },
    ]);
    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.manualReviewRequired).toBe(true);
    expect(candidates[0]?.safetyNote).toContain('internal lead/opportunity');
  });

  it('scores retainer opportunities without guaranteeing outcomes', () => {
    const alerts = buildRetainerOpportunityAlerts([
      { clientName: 'Seller A', completedJobs: 3, deliveredImages: 60, daysSinceLastDelivery: 21, hasActiveSubscription: false, creditBalance: 0, grossRevenueCents: 50000 },
    ], 50);
    expect(alerts[0]?.priority).toBe('HIGH');
    expect(alerts[0]?.safetyNote).toContain('do not guarantee sales');
  });
});
