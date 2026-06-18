import { isSafeSecurityCopy } from '@/domain/security-hardening';

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

export function stripUnsafeMarkup(input: string) {
  return escapeHtml(input).replace(/javascript:/gi, 'blocked:').replace(/data:text\/html/gi, 'blocked:');
}

export function neutralizeCsvFormulaCell(value: string) {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

export function assertClientFacingSecurityCopy(input: string) {
  if (!isSafeSecurityCopy(input)) {
    throw new Error('Unsafe marketplace-result guarantee detected in client-facing copy.');
  }
  return true;
}

export function buildSafeOutputPreview(input: string) {
  assertClientFacingSecurityCopy(input);
  return {
    escapedHtml: stripUnsafeMarkup(input),
    csvSafe: neutralizeCsvFormulaCell(input),
    marketplaceGuaranteeFree: true,
  };
}
