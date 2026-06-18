export type ClientUpgradeSignal = {
  activeJobs?: number;
  completedJobs?: number;
  monthlyImages?: number;
  agencyClientCount?: number;
  creditsRemaining?: number;
  openUpsellOpportunities?: number;
};

export function recommendClientDashboardUpgrades(signal: ClientUpgradeSignal) {
  const recommendations: Array<{ key: string; title: string; reason: string; manualReviewRequired: boolean }> = [];
  if ((signal.monthlyImages ?? 0) >= 40 || (signal.completedJobs ?? 0) >= 3) {
    recommendations.push({ key: 'monthly-seller-image-retainer', title: 'Monthly Seller Image Retainer', reason: 'Recurring product image work may fit a monthly allowance.', manualReviewRequired: true });
  }
  if ((signal.agencyClientCount ?? 0) >= 2) {
    recommendations.push({ key: 'agency-white-label-image-fulfillment', title: 'Agency White-Label Image Fulfillment', reason: 'Multiple client workspaces may fit white-label fulfillment.', manualReviewRequired: true });
  }
  if ((signal.creditsRemaining ?? 0) <= 5) {
    recommendations.push({ key: 'credit-top-up', title: 'Credit top-up', reason: 'Credit balance is low for upcoming batches.', manualReviewRequired: true });
  }
  if ((signal.openUpsellOpportunities ?? 0) > 0 && recommendations.length === 0) {
    recommendations.push({ key: 'product-launch-image-pack', title: 'Product Launch Image Pack', reason: 'Additional variations may support launch assets and social-commerce drafts.', manualReviewRequired: true });
  }
  return recommendations;
}
