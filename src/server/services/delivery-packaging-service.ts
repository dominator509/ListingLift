import { DEFAULT_PLATFORM_PRESETS } from '@/domain/platform-presets';
import {
  assertSafeDeliveryRelativePath,
  buildDeliveryRootFolder,
  buildDeliveryZipFileName,
  buildDeliveryZipStorageKey,
  normalizeDeliveryFolderPath,
  type DeliveryArchiveFilePlan,
  type DeliveryArchiveInput,
  type DeliveryArchivePlan,
  type DeliveryProcessedFileInput,
} from '@/domain/delivery-packaging';
import { buildArchiveRelativePath, buildOutputFileName, ensureUniqueFileNames, normalizeFileExtension } from './naming-service';
import { foldersForPresets } from './delivery-folder-service';
import { buildManifestCsvFromArchiveFiles, buildManifestSummary } from './manifest-service';
import { buildComplianceSafeDeliveryReadme } from './delivery-readme-service';


function mimeTypeForDeliveryFormat(format: string) {
  switch (format.toUpperCase()) {
    case 'JPG':
    case 'JPEG':
      return 'image/jpeg';
    case 'PNG':
      return 'image/png';
    case 'WEBP':
      return 'image/webp';
    case 'CSV':
      return 'text/csv';
    case 'TXT':
      return 'text/plain';
    case 'ZIP':
      return 'application/zip';
    case 'PDF':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

function platformForPresetKey(presetKey?: string | null) {
  if (!presetKey) return null;
  return DEFAULT_PLATFORM_PRESETS.find((preset) => preset.key === presetKey)?.platform ?? null;
}

function folderForProcessedFile(file: DeliveryProcessedFileInput) {
  if (file.folderPath) return normalizeDeliveryFolderPath(file.folderPath);
  const preset = DEFAULT_PLATFORM_PRESETS.find((item) => item.key === file.presetKey);
  return normalizeDeliveryFolderPath(preset?.folderPath ?? 'Custom');
}

function formatFromFile(file: DeliveryProcessedFileInput) {
  return String(file.outputFormat || normalizeFileExtension(file.fileName.split('.').pop() || 'bin')).toUpperCase();
}

function archiveFileFromProcessedFile(input: {
  rootFolder: string;
  file: DeliveryProcessedFileInput;
  index: number;
  jobNumberOrId: string;
  clientName: string;
}): DeliveryArchiveFilePlan {
  const folderPath = folderForProcessedFile(input.file);
  const extension = normalizeFileExtension(input.file.fileName.split('.').pop() || String(input.file.outputFormat));
  const plannedName = buildOutputFileName({
    clientName: input.clientName,
    jobId: input.jobNumberOrId,
    jobNumber: input.jobNumberOrId,
    sku: input.file.sourceImageName?.replace(/\.[^.]+$/, ''),
    sourceFileBaseName: input.file.sourceImageName?.replace(/\.[^.]+$/, ''),
    presetKey: input.file.presetKey ?? input.file.outputType,
    platform: input.file.platform ?? platformForPresetKey(input.file.presetKey),
    outputType: input.file.outputType,
    index: input.index,
    extension,
  });
  const fileName = input.file.fileName || plannedName;
  const archivePath = buildArchiveRelativePath({ rootFolder: input.rootFolder, folderPath, fileName });
  const format = formatFromFile(input.file);
  const status = input.file.status === 'FAILED' ? 'failed' : input.file.approvedStatus === 'REJECTED' ? 'excluded' : 'included';

  return {
    kind: 'OUTPUT',
    processedFileId: input.file.id,
    sourceImageId: input.file.imageId ?? null,
    sourceImageName: input.file.sourceImageName ?? null,
    presetKey: input.file.presetKey ?? null,
    platform: input.file.platform ?? platformForPresetKey(input.file.presetKey),
    folderPath,
    fileName,
    archivePath,
    storageKey: input.file.storageKey,
    mimeType: input.file.mimeType || mimeTypeForDeliveryFormat(format),
    width: input.file.width ?? null,
    height: input.file.height ?? null,
    sizeBytes: input.file.sizeBytes ?? null,
    format,
    outputType: input.file.outputType,
    backgroundType: input.file.backgroundType ?? null,
    status,
    sellerReviewRequired: input.file.sellerReviewRequired ?? true,
    notes: input.file.notes ?? 'Seller review recommended before publishing.',
  };
}

function metadataFile(input: { rootFolder: string; fileName: string; contentKind: 'MANIFEST' | 'README'; format: 'CSV' | 'TXT'; mimeType: string }): DeliveryArchiveFilePlan {
  const archivePath = buildArchiveRelativePath({ rootFolder: input.rootFolder, folderPath: '', fileName: input.fileName });
  return {
    kind: input.contentKind,
    folderPath: '',
    fileName: input.fileName,
    archivePath,
    mimeType: input.mimeType,
    format: input.format,
    status: 'included',
    sellerReviewRequired: false,
  };
}

export function buildDeliveryArchivePlan(input: DeliveryArchiveInput): DeliveryArchivePlan {
  const jobNumberOrId = input.jobNumber || input.jobId;
  const rootFolder = buildDeliveryRootFolder({ clientName: input.clientName, jobNumberOrId });
  assertSafeDeliveryRelativePath(rootFolder);
  const selectedPresets = input.selectedPresets?.length ? input.selectedPresets : DEFAULT_PLATFORM_PRESETS;
  const folders = foldersForPresets(selectedPresets);

  const outputFiles = ensureUniqueFileNames(
    input.processedFiles.map((file, index) => archiveFileFromProcessedFile({
      rootFolder,
      file,
      index: index + 1,
      jobNumberOrId,
      clientName: input.clientName,
    })),
  ).map((file) => ({
    ...file,
    archivePath: buildArchiveRelativePath({ rootFolder, folderPath: file.folderPath, fileName: file.fileName }),
  }));

  const manifestCsv = buildManifestCsvFromArchiveFiles(outputFiles);
  const readmeText = buildComplianceSafeDeliveryReadme({
    clientName: input.clientName,
    jobNumberOrId,
    fileCount: outputFiles.length + 2,
    outputCount: outputFiles.length,
    folders,
  });

  const files: DeliveryArchiveFilePlan[] = [...outputFiles];
  if (input.includeManifest ?? true) files.push(metadataFile({ rootFolder, fileName: 'Manifest.csv', contentKind: 'MANIFEST', format: 'CSV', mimeType: 'text/csv' }));
  if (input.includeReadme ?? true) files.push(metadataFile({ rootFolder, fileName: 'ReadMe.txt', contentKind: 'README', format: 'TXT', mimeType: 'text/plain' }));

  const summary = buildManifestSummary(outputFiles);
  return {
    organizationId: input.organizationId,
    jobId: input.jobId,
    jobNumber: input.jobNumber ?? null,
    clientName: input.clientName,
    rootFolder,
    status: 'PLANNED',
    files,
    folders,
    manifestCsv,
    readmeText,
    zipFileName: buildDeliveryZipFileName({ clientName: input.clientName, jobNumberOrId }),
    zipStorageKey: buildDeliveryZipStorageKey({ organizationId: input.organizationId, jobId: input.jobId, rootFolder }),
    fileCount: files.length,
    outputCount: summary.totalRows,
    missingCount: summary.missingRows,
    sellerReviewRequired: summary.sellerReviewRequiredRows > 0,
    metadata: {
      generatedByUserId: input.generatedByUserId ?? null,
      includeBeforeAfter: input.includeBeforeAfter ?? true,
      includeManifest: input.includeManifest ?? true,
      includeReadme: input.includeReadme ?? true,
      safeLanguage: 'platform-ready draft; seller-review recommended; no marketplace approval guarantee',
    },
  };
}
