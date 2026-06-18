import { PageHeader } from '@/components/ui/page-header';

import { SocialCommerceManualOrderForm, SocialCommerceRevenueSummaryCard } from '@/components/social-commerce';

export default function SocialCommerceOrderIntakePage() {
  return <main className="space-y-6 p-6"><PageHeader title="Social-commerce order intake" description="Create manual social-commerce source records without scraping, password storage, or unsafe automation." /><SocialCommerceManualOrderForm /><SocialCommerceRevenueSummaryCard /></main>;
}
