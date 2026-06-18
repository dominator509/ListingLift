import { REQUIRED_DELIVERY_ROOT_FOLDERS, buildDeliveryRootFolder, normalizeDeliveryFolderPath, assertSafeDeliveryRelativePath } from '@/domain/delivery-packaging';
import type { PlatformPreset } from '@/domain/platform-presets';

export function buildDeliveryRoot(clientName: string, jobId: string) {
  return buildDeliveryRootFolder({ clientName, jobNumberOrId: jobId });
}

export function foldersForPresets(presets: PlatformPreset[]) {
  const folders = new Set<string>(REQUIRED_DELIVERY_ROOT_FOLDERS);
  for (const preset of presets) {
    folders.add(normalizeDeliveryFolderPath(preset.folderPath));
    if (preset.folderDestination?.platformFolder && preset.folderDestination?.outputFolder) {
      folders.add(normalizeDeliveryFolderPath(`${preset.folderDestination.platformFolder}/${preset.folderDestination.outputFolder}`));
    }
  }
  return [...folders].filter(Boolean).sort((a, b) => a.localeCompare(b));
}

export function buildFolderTree(rootFolder: string, folders: string[]) {
  const root = normalizeDeliveryFolderPath(rootFolder);
  assertSafeDeliveryRelativePath(root);
  return folders.map((folder) => {
    const safeFolder = normalizeDeliveryFolderPath(folder);
    const archivePath = `${root}/${safeFolder}`;
    assertSafeDeliveryRelativePath(archivePath);
    return {
      folderPath: safeFolder,
      archivePath,
      depth: safeFolder.split('/').filter(Boolean).length,
    };
  });
}

export function buildReadmeText() {
  return [
    'ListingLift Delivery Pack',
    '',
    'These files are platform-ready drafts formatted for common marketplace, ecommerce, and social-commerce use.',
    'Seller review is recommended before publishing.',
    'Review all outputs against current marketplace, ecommerce, and advertising platform guidelines before use.',
    'ListingLift does not guarantee marketplace approval, rankings, conversions, sales, listing approval, product approval, or ad performance.',
    '',
    'Included files may contain transparent PNGs, white-background JPGs, WebP variants, before/after previews, and a manifest CSV.',
  ].join('\n');
}
