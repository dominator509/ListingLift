import { PageHeader } from '@/components/ui/page-header';

import { SocialCommerceDeliveryTemplatePanel, SocialCommerceSafetyPanel } from '@/components/social-commerce';

export default function SocialCommerceDeliveryPage() {
  return <main className="space-y-6 p-6"><PageHeader title="Social-commerce delivery" description="Generate platform-safe manual delivery copy for approved archives only." /><SocialCommerceDeliveryTemplatePanel /><SocialCommerceSafetyPanel /></main>;
}
