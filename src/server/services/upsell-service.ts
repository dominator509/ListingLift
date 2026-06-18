export function recommendUpsells(packageKey?: string | null) {
  if (packageKey === 'QuickCleanup10') return ['Marketplace Listing Pack', 'Monthly Seller Image Retainer'];
  if (packageKey === 'MarketplaceListing25') return ['Product Launch Image Pack', 'Monthly Seller Image Retainer'];
  if (packageKey === 'ProductLaunch50') return ['Monthly Seller Image Retainer', 'Ad creative pack'];
  return ['More image packs', 'Listing SEO', 'Product description rewrite'];
}
