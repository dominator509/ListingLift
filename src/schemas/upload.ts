export interface ZipEntryMetadata {
  path: string;
  sizeBytes: number;
  isDirectory: boolean;
}

export interface UploadFileMetadata {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  sha256?: string;
  width?: number;
  height?: number;
}

export const uploadBatchIntakeRequestSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      organizationId: input.organizationId as string | undefined,
      jobId: input.jobId as string | undefined,
      files: input.files as Array<{ fileName: string; mimeType: string; sizeBytes: number }> | undefined,
      source: input.source as string | undefined,
    };
  },
};

export const uploadTokenIssueSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      organizationId: input.organizationId as string | undefined,
      jobId: input.jobId as string | undefined,
      expiresInMinutes: input.expiresInMinutes as number | undefined,
      maxFileSize: input.maxFileSize as number | undefined,
      allowedTypes: input.allowedTypes as string[] | undefined,
      maxFiles: 10,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'],
    };
  },
};

export const uploadCompleteRequestSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      token: input.token as string,
      uploadBatchId: input.uploadBatchId as string,
      files: input.files as Array<{ name: string; size: number; type: string; key: string }> | undefined,
    };
  },
};

export const uploadFileMetadataSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return { name: input.name as string, size: input.size as number, type: input.type as string };
  },
};

export const uploadTokenResolveSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return { token: input.token as string };
  },
};

export const zipInspectionRequestSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    return {
      archive: input.archive as { fileName: string; mimeType: string; sizeBytes: number } | undefined,
      entries: input.entries as Array<{ path: string; sizeBytes: number; isDirectory: boolean }> | undefined,
      zipId: input.zipId as string | undefined,
    };
  },
};
