import { MarketplaceComplianceWarningPanel, MarketplaceDeliveryTemplatePanel, MarketplaceExportBoard, MarketplaceExportPlanPanel, MarketplaceManualOrderForm, MarketplaceSafetyPanel } from '@/components/marketplace-exports';

export default function MarketplaceExportsPage() {
  return <div className="space-y-6"><MarketplaceExportBoard /><MarketplaceComplianceWarningPanel /></div>;
}
