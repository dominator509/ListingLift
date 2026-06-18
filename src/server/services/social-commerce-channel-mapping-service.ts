import { DEFAULT_SOCIAL_COMMERCE_CHANNELS, getSocialCommerceChannelDefinition, type SocialCommerceChannelKey } from '@/domain/social-commerce';
import { socialCommerceMappingInputSchema, type SocialCommerceMappingInput } from '@/schemas/social-commerce';

export function listSocialCommerceChannelMappings() {
  return DEFAULT_SOCIAL_COMMERCE_CHANNELS.map((channel) => ({ ...channel, status: 'MANUAL_FALLBACK_READY' }));
}

export function getSocialCommerceChannelMapping(key: string) {
  return getSocialCommerceChannelDefinition(key);
}

export function buildSocialCommerceMappingDraft(input: SocialCommerceMappingInput) {
  const parsed = socialCommerceMappingInputSchema.parse(input);
  const base = getSocialCommerceChannelDefinition(parsed.channelKey);
  return {
    channelKey: parsed.channelKey as SocialCommerceChannelKey,
    label: base.label,
    packageKey: parsed.packageKey,
    defaultPresetKeys: parsed.defaultPresetKeys.length ? parsed.defaultPresetKeys : base.defaultPresetKeys,
    defaultCreativeFormats: parsed.defaultCreativeFormats.length ? parsed.defaultCreativeFormats : base.defaultCreativeFormats,
    defaultDeliveryMode: parsed.defaultDeliveryMode,
    manualFallbackOnly: parsed.manualFallbackOnly,
    supportsExternalLinks: parsed.supportsExternalLinks,
    active: true,
    safeDescription: base.safeDescription,
    note: 'Seed draft only. Codex must persist tenant-scoped SocialCommerceChannelMapping rows and audit changes.',
  };
}
