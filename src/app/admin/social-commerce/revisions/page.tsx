import { PageHeader } from '@/components/ui/page-header';

import { SocialCommerceRevisionStatusPanel } from '@/components/social-commerce';

export default function SocialCommerceRevisionsPage() {
  return <main className="space-y-6 p-6"><PageHeader title="Social-commerce revisions" description="Track revision status and block completion while social-commerce revisions are open." /><SocialCommerceRevisionStatusPanel /></main>;
}
