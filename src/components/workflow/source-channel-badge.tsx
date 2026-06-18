import { Badge } from '@/components/ui/badge';
import { DEFAULT_SALES_CHANNELS } from '@/domain/sales-channels';

export function SourceChannelBadge({ channelKey }: { channelKey: string }) {
  const channel = DEFAULT_SALES_CHANNELS.find((item) => item.key === channelKey);
  return <Badge tone={channel?.enabledByDefault ? 'green' : 'purple'}>{channel?.name ?? channelKey}</Badge>;
}
