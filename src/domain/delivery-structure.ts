export const DELIVERY_FOLDER_STRUCTURE = {
  Amazon: ['white-background', 'secondary-images'],
  Etsy: ['square-listing'],
  Shopify: ['product-gallery'],
  'TikTok-Shop': ['vertical'],
  Instagram: ['square', 'story'],
  'Transparent-PNG': [],
  'White-JPG': [],
  'Before-After': [],
} as const;

export const DELIVERY_REQUIRED_FILES = ['Manifest.csv', 'ReadMe.txt'] as const;
