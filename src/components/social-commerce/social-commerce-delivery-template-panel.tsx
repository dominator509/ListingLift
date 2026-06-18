import { Card } from '@/components/ui/card';
import { buildSocialCommerceDeliveryMessage } from '@/domain/social-commerce';

export function SocialCommerceDeliveryTemplatePanel() {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">Delivery message template</h2>
      <pre className="mt-3 whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">{buildSocialCommerceDeliveryMessage({ channelKey: 'tiktok_shop', buyerName: 'Seller', archiveName: 'ListingLift social pack', externalLinkAllowed: false })}</pre>
    </Card>
  );
}
