import { ALLOWED_UPLOAD_MIME_TYPES, getFileExtension, isUnsafeFileName, UPLOAD_INTAKE_LIMITS } from '@/domain/upload-intake';
import { securityUploadProbeSchema, securityZipEntryProbeSchema, type SecurityUploadProbeInput, type SecurityZipEntryProbeInput } from '@/schemas/security-hardening';
import { validateSingleUploadFile } from '@/server/services/upload-validation-service';
import { validateZipEntries } from '@/server/services/zip-safety-service';

export type SecurityGuardIssue = {
  code: string;
  severity: 'error' | 'warning';
  message: string;
};

export function evaluateSecurityUploadProbe(input: SecurityUploadProbeInput) {
  const parsed = securityUploadProbeSchema.parse(input);
  const issues: SecurityGuardIssue[] = [];
  const extension = getFileExtension(parsed.fileName);

  if (!(ALLOWED_UPLOAD_MIME_TYPES as readonly string[]).includes(parsed.mimeType)) {
    issues.push({ code: 'mime_not_allowlisted', severity: 'error', message: 'Upload MIME type is not allowlisted for ListingLift product photo intake.' });
  }

  if (isUnsafeFileName(parsed.fileName)) {
    issues.push({ code: 'unsafe_extension_or_path', severity: 'error', message: 'Executable/script-like files, HTML/SVG, null-byte names, and traversal paths are rejected.' });
  }

  if (parsed.sizeBytes > UPLOAD_INTAKE_LIMITS.maxArchiveBytes) {
    issues.push({ code: 'upload_exceeds_absolute_limit', severity: 'error', message: 'Upload exceeds the absolute archive-size ceiling.' });
  }

  const canRunExistingValidator = (ALLOWED_UPLOAD_MIME_TYPES as readonly string[]).includes(parsed.mimeType);
  const intakeResult = canRunExistingValidator
    ? validateSingleUploadFile({ fileName: parsed.fileName, mimeType: parsed.mimeType as (typeof ALLOWED_UPLOAD_MIME_TYPES)[number], sizeBytes: parsed.sizeBytes, sha256: parsed.sha256, width: parsed.width, height: parsed.height })
    : null;

  if (intakeResult) {
    for (const issue of intakeResult.issues) {
      issues.push({ code: issue.code, severity: issue.severity, message: issue.message });
    }
  }

  return {
    accepted: !issues.some((issue) => issue.severity === 'error'),
    sourceSurface: parsed.sourceSurface,
    fileName: parsed.fileName,
    extension,
    mimeType: parsed.mimeType,
    sizeBytes: parsed.sizeBytes,
    parseabilityCheckRequired: true,
    preserveOriginalRequired: true,
    codexNote: 'Codex must wire runtime image parseability checks, object-storage quarantine, tenant/job token scope, and never overwrite original uploads.',
    issues,
  };
}

export function evaluateSecurityZipProbe(entries: SecurityZipEntryProbeInput[]) {
  const parsed = entries.map((entry) => securityZipEntryProbeSchema.parse(entry));
  const result = validateZipEntries(parsed);
  return {
    ...result,
    nestedArchiveRejected: true,
    zipSlipProtectionRequired: true,
    codexNote: 'Codex must validate ZIP contents before extraction and run ZIP slip tests against real JSZip/streaming archive handling.',
  };
}
