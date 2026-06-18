import { assertSafeDeliveryRelativePath, normalizeDeliveryFolderPath, normalizeDeliverySegment } from '@/domain/delivery-packaging';

export function slugifyFileSegment(value: string) {
  return normalizeDeliverySegment(value, 'item').toLowerCase();
}

export type OutputFileNameInput = {
  clientName: string;
  jobId: string;
  jobNumber?: string | null;
  sku?: string | null;
  productName?: string | null;
  sourceFileBaseName?: string | null;
  presetKey: string;
  platform?: string | null;
  outputType?: string | null;
  index: number;
  extension: string;
};

export function normalizeFileExtension(extension: string) {
  return normalizeDeliverySegment(extension.replace(/^\./, '').toLowerCase(), 'bin').replace(/[^a-z0-9]/g, '') || 'bin';
}

export function buildOutputFileName(input: OutputFileNameInput) {
  const skuOrProduct = input.sku || input.productName || input.sourceFileBaseName || 'product';
  const sku = slugifyFileSegment(skuOrProduct);
  const index = String(input.index).padStart(3, '0');
  const preset = slugifyFileSegment(input.presetKey);
  const job = slugifyFileSegment(input.jobNumber || input.jobId);
  const extension = normalizeFileExtension(input.extension);
  const outputType = input.outputType ? `${slugifyFileSegment(input.outputType)}-` : '';
  return `${sku}-${job}-${index}-${outputType}${preset}.${extension}`.slice(0, 180);
}

export function buildBeforeAfterFileName(input: { sourceFileBaseName: string; jobNumberOrId: string; index: number; extension?: string }) {
  const source = slugifyFileSegment(input.sourceFileBaseName || 'before-after');
  const job = slugifyFileSegment(input.jobNumberOrId);
  const index = String(input.index).padStart(3, '0');
  const extension = normalizeFileExtension(input.extension || 'jpg');
  return `${source}-${job}-${index}-before-after.${extension}`.slice(0, 180);
}

export function buildArchiveRelativePath(input: { rootFolder: string; folderPath: string; fileName: string }) {
  const root = normalizeDeliveryFolderPath(input.rootFolder);
  const folder = normalizeDeliveryFolderPath(input.folderPath);
  const fileName = normalizeDeliverySegment(input.fileName, 'file');
  const relativePath = [root, folder, fileName].filter(Boolean).join('/');
  assertSafeDeliveryRelativePath(relativePath);
  return relativePath;
}

export function ensureUniqueFileNames<T extends { fileName: string; folderPath: string }>(items: T[]) {
  const seen = new Map<string, number>();
  return items.map((item) => {
    const key = `${item.folderPath}/${item.fileName}`.toLowerCase();
    const count = seen.get(key) ?? 0;
    seen.set(key, count + 1);
    if (count === 0) return item;
    const dot = item.fileName.lastIndexOf('.');
    const suffix = `-${String(count + 1).padStart(2, '0')}`;
    const fileName = dot > 0 ? `${item.fileName.slice(0, dot)}${suffix}${item.fileName.slice(dot)}` : `${item.fileName}${suffix}`;
    return { ...item, fileName };
  });
}
