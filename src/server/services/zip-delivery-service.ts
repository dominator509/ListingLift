import JSZip from 'jszip';
import { assertSafeDeliveryRelativePath, type DeliveryArchiveFilePlan, type DeliveryArchivePlan } from '@/domain/delivery-packaging';
import { neutralizeCsvCell } from '@/lib/csv';

export type ZipFileInput = {
  folderPath: string;
  fileName: string;
  content: string | Uint8Array;
};

export async function createDeliveryZip(files: ZipFileInput[]) {
  const zip = new JSZip();
  for (const file of files) {
    const safePath = `${file.folderPath}/${file.fileName}`.replace(/\\/g, '/').replace(/^\/+/, '');
    assertSafeDeliveryRelativePath(safePath);
    zip.file(safePath, file.content);
  }
  return zip.generateAsync({ type: 'uint8array' });
}

export function buildDeliveryReadme(clientName: string) {
  return [
    `ListingLift delivery for ${neutralizeCsvCell(clientName)}`,
    '',
    'These files are platform-ready drafts formatted for common marketplace use.',
    'Seller review is recommended before publishing.',
    'ListingLift does not guarantee marketplace approval, ranking, sales, conversion lift, listing approval, product approval, or ad performance.',
  ].join('\n');
}

export function buildZipEntryPlan(plan: DeliveryArchivePlan) {
  return plan.files.map((file) => {
    assertSafeDeliveryRelativePath(file.archivePath);
    return {
      archivePath: file.archivePath,
      storageKey: file.storageKey ?? null,
      kind: file.kind,
      contentRequiredFromStorage: file.kind === 'OUTPUT' || file.kind === 'BEFORE_AFTER',
    };
  });
}

export async function createDeliveryZipFromArchivePlan(
  plan: DeliveryArchivePlan,
  loadContent: (file: DeliveryArchiveFilePlan) => Promise<string | Uint8Array>,
) {
  const zip = new JSZip();
  for (const file of plan.files) {
    assertSafeDeliveryRelativePath(file.archivePath);
    zip.file(file.archivePath, await loadContent(file));
  }
  return zip.generateAsync({ type: 'uint8array' });
}
