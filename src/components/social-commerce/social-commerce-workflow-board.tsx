import { Card } from '@/components/ui/card';
import { DEFAULT_SOCIAL_COMMERCE_CHANNELS } from '@/domain/social-commerce';

export function SocialCommerceWorkflowBoard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {DEFAULT_SOCIAL_COMMERCE_CHANNELS.map((channel) => (
        <Card key={channel.key} className="p-4">
          <div className="text-sm font-semibold">{channel.label}</div>
          <div className="mt-1 text-xs text-muted-foreground">{channel.channelType} · {channel.defaultDeliveryMode}</div>
          <div className="mt-3 text-sm">Preset outputs: {channel.defaultPresetKeys.join(', ')}</div>
          <div className="mt-2 text-xs text-muted-foreground">Manual fallback: {channel.manualFallbackOnly ? 'Required' : 'Available'}</div>
        </Card>
      ))}
    </div>
  );
}
