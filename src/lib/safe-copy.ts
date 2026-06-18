export const MARKETPLACE_SAFE_CLAIM = 'Formatted as a platform-ready draft. Seller review against current platform guidelines is recommended before publishing.';

export function marketplaceSafeDescription(platform: string) {
  return `${platform}: platform-ready draft; not a guarantee of marketplace approval, ranking, sales, or ad performance.`;
}
