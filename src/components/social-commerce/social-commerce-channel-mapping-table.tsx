import { DEFAULT_SOCIAL_COMMERCE_CHANNELS } from '@/domain/social-commerce';

export function SocialCommerceChannelMappingTable() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted"><tr><th className="p-2 text-left">Channel</th><th className="p-2 text-left">Package</th><th className="p-2 text-left">Presets</th><th className="p-2 text-left">Delivery</th></tr></thead>
        <tbody>
          {DEFAULT_SOCIAL_COMMERCE_CHANNELS.map((channel) => (
            <tr key={channel.key} className="border-t"><td className="p-2 font-medium">{channel.label}</td><td className="p-2">{channel.packageKey}</td><td className="p-2">{channel.defaultPresetKeys.join(', ')}</td><td className="p-2">{channel.defaultDeliveryMode}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
