import { DELIVERY_MANIFEST_COLUMNS, type DeliveryArchiveFilePlan, type ManifestStatus } from '@/domain/delivery-packaging';
import { safeCsvCell } from '@/lib/csv';

export type ManifestRow = {
  archivePath: string;
  sourceImage: string;
  outputFile: string;
  sourceImageId?: string | null;
  processedFileId?: string | null;
  presetKey?: string | null;
  platform: string;
  folderPath: string;
  width?: number | string | null;
  height?: number | string | null;
  format: string;
  outputType?: string | null;
  backgroundType?: string | null;
  status: ManifestStatus | string;
  sellerReviewRequired: boolean;
  notes?: string | null;
};

export function manifestRowFromArchiveFile(file: DeliveryArchiveFilePlan): ManifestRow {
  return {
    archivePath: file.archivePath,
    sourceImage: file.sourceImageName ?? '',
    outputFile: file.fileName,
    sourceImageId: file.sourceImageId ?? '',
    processedFileId: file.processedFileId ?? '',
    presetKey: file.presetKey ?? '',
    platform: file.platform ?? '',
    folderPath: file.folderPath,
    width: file.width ?? '',
    height: file.height ?? '',
    format: file.format,
    outputType: file.outputType ?? '',
    backgroundType: file.backgroundType ?? '',
    status: file.status,
    sellerReviewRequired: file.sellerReviewRequired,
    notes: file.notes ?? '',
  };
}

function csvEscape(value: unknown) {
  return `"${safeCsvCell(value).replace(/"/g, '""')}"`;
}

export function buildManifestCsv(rows: ManifestRow[]) {
  const lines = [DELIVERY_MANIFEST_COLUMNS.join(',')];
  for (const row of rows) {
    lines.push(
      [
        row.archivePath,
        row.sourceImage,
        row.outputFile,
        row.sourceImageId ?? '',
        row.processedFileId ?? '',
        row.presetKey ?? '',
        row.platform,
        row.folderPath,
        row.width ?? '',
        row.height ?? '',
        row.format,
        row.outputType ?? '',
        row.backgroundType ?? '',
        row.status,
        row.sellerReviewRequired ? 'yes' : 'no',
        row.notes ?? '',
      ].map(csvEscape).join(','),
    );
  }
  return `${lines.join('\n')}\n`;
}

export function buildManifestCsvFromArchiveFiles(files: DeliveryArchiveFilePlan[]) {
  return buildManifestCsv(files.filter((file) => file.kind === 'OUTPUT' || file.kind === 'BEFORE_AFTER').map(manifestRowFromArchiveFile));
}

export function buildManifestSummary(files: DeliveryArchiveFilePlan[]) {
  const outputFiles = files.filter((file) => file.kind === 'OUTPUT' || file.kind === 'BEFORE_AFTER');
  return {
    totalRows: outputFiles.length,
    includedRows: outputFiles.filter((file) => file.status === 'included').length,
    missingRows: outputFiles.filter((file) => file.status === 'missing' || file.status === 'failed').length,
    manualReplacementRows: outputFiles.filter((file) => file.status === 'manual_replacement').length,
    sellerReviewRequiredRows: outputFiles.filter((file) => file.sellerReviewRequired).length,
  };
}
