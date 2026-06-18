import { PageHeader } from '@/components/ui/page-header';

import { SocialCommerceWorkflowBoard, SocialCommerceChannelMappingTable, SocialCommerceSafetyPanel } from '@/components/social-commerce';

export default function SocialCommerceAdminPage() {
  return <main className="space-y-6 p-6"><PageHeader title="Social commerce workflows" description="Manual and platform-safe intake, creative planning, delivery, and revision tracking for TikTok Shop, Instagram, Facebook Marketplace, Pinterest, and creator/social sources." /><SocialCommerceWorkflowBoard /><SocialCommerceChannelMappingTable /><SocialCommerceSafetyPanel /></main>;
}
