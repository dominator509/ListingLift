import { MarketplaceComplianceWarningPanel, MarketplaceDeliveryTemplatePanel, MarketplaceExportBoard, MarketplaceExportPlanPanel, MarketplaceManualOrderForm, MarketplaceSafetyPanel } from '@/components/marketplace-exports';

export default function MarketplaceExportsSafetyPage() {
  return <div className="space-y-6"><MarketplaceSafetyPanel /><MarketplaceComplianceWarningPanel /></div>;
}
