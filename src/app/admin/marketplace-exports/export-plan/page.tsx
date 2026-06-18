import { MarketplaceComplianceWarningPanel, MarketplaceDeliveryTemplatePanel, MarketplaceExportBoard, MarketplaceExportPlanPanel, MarketplaceManualOrderForm, MarketplaceSafetyPanel } from '@/components/marketplace-exports';

export default function MarketplaceExportsExportPlanPage() {
  return <div className="space-y-6"><MarketplaceExportPlanPanel /><MarketplaceComplianceWarningPanel /></div>;
}
