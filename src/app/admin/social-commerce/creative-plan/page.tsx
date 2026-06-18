import { PageHeader } from '@/components/ui/page-header';

import { SocialCommerceCreativePlanPanel } from '@/components/social-commerce';

export default function SocialCommerceCreativePlanPage() {
  return <main className="space-y-6 p-6"><PageHeader title="Social-commerce creative plans" description="Plan social-commerce image variants, product sequence, caption notes, and seller-review guidance." /><SocialCommerceCreativePlanPanel /></main>;
}
