import { MarketplaceComplianceWarningPanel, MarketplaceDeliveryTemplatePanel, MarketplaceExportBoard, MarketplaceExportPlanPanel, MarketplaceManualOrderForm, MarketplaceSafetyPanel } from '@/components/marketplace-exports';

export default function MarketplaceExportsDeliveryPage() {
  return <div className="space-y-6"><MarketplaceDeliveryTemplatePanel /><MarketplaceSafetyPanel /></div>;
}
