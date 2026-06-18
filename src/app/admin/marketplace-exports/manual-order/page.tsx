import { MarketplaceComplianceWarningPanel, MarketplaceDeliveryTemplatePanel, MarketplaceExportBoard, MarketplaceExportPlanPanel, MarketplaceManualOrderForm, MarketplaceSafetyPanel } from '@/components/marketplace-exports';

export default function MarketplaceExportsManualOrderPage() {
  return <div className="space-y-6"><MarketplaceManualOrderForm /><MarketplaceSafetyPanel /></div>;
}
