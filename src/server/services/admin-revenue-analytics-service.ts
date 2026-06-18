import {
  ADMIN_ANALYTICS_SAFE_COPY,
  formatAdminMoneyFromCents,
  normalizeRevenueChannel,
  scoreRetainerOpportunity,
  sumRevenueChannels,
  type AdminConversionCandidate,
  type AdminRevenueChannelInput,
  type RetainerOpportunitySignal,
} from '@/domain/admin-dashboard-analytics';

export const demoRevenueChannels: AdminRevenueChannelInput[] = [
  { channelKey: 'Direct', channelName: 'Direct Website', channelType: 'DIRECT', orderCount: 8, jobCount: 8, completedJobCount: 5, grossRevenueCents: 182500, currency: 'USD', directConversionCount: 0, retainerCandidateCount: 2 },
  { channelKey: 'Stripe', channelName: 'Stripe Checkout', channelType: 'PAYMENT', orderCount: 6, jobCount: 6, completedJobCount: 4, grossRevenueCents: 127400, currency: 'USD', directConversionCount: 0, retainerCandidateCount: 1 },
  { channelKey: 'Etsy', channelName: 'Etsy Manual Workflow', channelType: 'ECOMMERCE', orderCount: 5, jobCount: 5, completedJobCount: 3, grossRevenueCents: 93400, currency: 'USD', directConversionCount: 2, retainerCandidateCount: 2 },
  { channelKey: 'Fiverr', channelName: 'Fiverr Manual Workflow', channelType: 'FREELANCE', orderCount: 4, jobCount: 4, completedJobCount: 4, grossRevenueCents: 59600, refundCents: 4900, currency: 'USD', directConversionCount: 1, retainerCandidateCount: 1 },
  { channelKey: 'Shopify', channelName: 'Shopify Store Workflow', channelType: 'ECOMMERCE', orderCount: 3, jobCount: 3, completedJobCount: 2, grossRevenueCents: 149700, currency: 'USD', directConversionCount: 1, retainerCandidateCount: 2 },
];

export function buildRevenueAnalyticsSnapshot(channels: AdminRevenueChannelInput[] = demoRevenueChannels, currency = 'USD') {
  const normalized = channels.map(normalizeRevenueChannel).sort((a, b) => b.netRevenueCents - a.netRevenueCents);
  const totals = sumRevenueChannels(normalized);
  return {
    currency,
    totals: {
      ...totals,
      formattedGrossRevenue: formatAdminMoneyFromCents(totals.grossRevenueCents, currency),
      formattedRefunds: formatAdminMoneyFromCents(totals.refundCents, currency),
      formattedNetRevenue: formatAdminMoneyFromCents(totals.netRevenueCents, currency),
      averageOrderValueCents: totals.orderCount > 0 ? Math.round(totals.netRevenueCents / totals.orderCount) : 0,
      conversionRatePercent: totals.orderCount > 0 ? Math.round((totals.directConversionCount / totals.orderCount) * 100) : 0,
    },
    channels: normalized.map((channel) => ({
      ...channel,
      formattedNetRevenue: formatAdminMoneyFromCents(channel.netRevenueCents, channel.currency),
      formattedAverageOrderValue: formatAdminMoneyFromCents(channel.averageOrderValueCents, channel.currency),
    })),
    notices: {
      revenue: ADMIN_ANALYTICS_SAFE_COPY.revenueNotice,
      source: ADMIN_ANALYTICS_SAFE_COPY.sourceNotice,
      privacy: ADMIN_ANALYTICS_SAFE_COPY.privacyNotice,
    },
    dryRun: true,
  };
}

export function detectMarketplaceToDirectConversionCandidates(candidates: AdminConversionCandidate[]) {
  return candidates
    .filter((candidate) => candidate.marketplaceOrderCount > 0 && candidate.directOrderCount > 0)
    .map((candidate) => ({
      ...candidate,
      totalOrderCount: candidate.marketplaceOrderCount + candidate.directOrderCount,
      conversionRatioPercent: Math.round((candidate.directOrderCount / Math.max(1, candidate.marketplaceOrderCount + candidate.directOrderCount)) * 100),
      manualReviewRequired: true,
      safetyNote: ADMIN_ANALYTICS_SAFE_COPY.conversionNotice,
    }))
    .sort((a, b) => b.grossRevenueCents - a.grossRevenueCents);
}

export function buildRetainerOpportunityAlerts(signals: RetainerOpportunitySignal[], minimumScore = 50, includeSubscribedClients = false) {
  return signals
    .map((signal) => {
      const score = scoreRetainerOpportunity(signal);
      return {
        ...signal,
        score,
        priority: score >= 80 ? 'HIGH' : score >= 60 ? 'MEDIUM' : 'LOW',
        suggestedAction: signal.hasActiveSubscription ? 'Review current retainer fit and allowance.' : 'Draft a manual retainer offer for admin approval.',
        manualReviewRequired: true,
        safetyNote: ADMIN_ANALYTICS_SAFE_COPY.retainerNotice,
      };
    })
    .filter((alert) => alert.score >= minimumScore)
    .filter((alert) => includeSubscribedClients || !alert.hasActiveSubscription)
    .sort((a, b) => b.score - a.score);
}

export const demoConversionCandidates: AdminConversionCandidate[] = [
  { clientId: 'client_aster', clientName: 'Aster Handmade', marketplaceSource: 'Etsy', directSource: 'Direct Website', marketplaceOrderCount: 4, directOrderCount: 2, grossRevenueCents: 126500, lastOrderAt: '2026-06-05T20:00:00.000Z' },
  { clientId: 'client_northstar', clientName: 'Northstar Goods', marketplaceSource: 'Fiverr', directSource: 'Stripe Checkout', marketplaceOrderCount: 2, directOrderCount: 1, grossRevenueCents: 88700, lastOrderAt: '2026-06-03T20:00:00.000Z' },
  { clientId: 'client_social', clientName: 'Bright Pantry', marketplaceSource: 'TikTok Shop', marketplaceOrderCount: 3, directOrderCount: 0, grossRevenueCents: 74900, lastOrderAt: '2026-06-04T20:00:00.000Z' },
];

export const demoRetainerSignals: RetainerOpportunitySignal[] = [
  { clientId: 'client_aster', clientName: 'Aster Handmade', sourceChannel: 'Etsy', completedJobs: 4, deliveredImages: 72, daysSinceLastDelivery: 18, hasActiveSubscription: false, creditBalance: 2, grossRevenueCents: 126500 },
  { clientId: 'client_northstar', clientName: 'Northstar Goods', sourceChannel: 'Shopify', completedJobs: 3, deliveredImages: 96, daysSinceLastDelivery: 9, hasActiveSubscription: false, creditBalance: 0, grossRevenueCents: 188000 },
  { clientId: 'client_retainer', clientName: 'Routine Seller Co.', sourceChannel: 'Direct', completedJobs: 8, deliveredImages: 160, daysSinceLastDelivery: 12, hasActiveSubscription: true, creditBalance: 18, grossRevenueCents: 314000 },
];
