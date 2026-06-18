import { assertReportSafeCopy } from '@/domain/reports-upsells';

export function inspectReportCopy(copy: string) {
  const unsafeMatches = assertReportSafeCopy(copy);
  return {
    safe: unsafeMatches.length === 0,
    unsafeMatches,
    requiredDisclaimer: 'Seller-review recommended. No marketplace approval, ranking, sales, conversion, or ad performance guarantee.',
  };
}

export function redactReportForClient(input: { body: string; includePrivateNotes?: boolean }) {
  let body = input.body;
  if (!input.includePrivateNotes) {
    body = body.replace(/Admin notes?:.*$/gim, 'Admin notes: redacted');
    body = body.replace(/Provider error:.*$/gim, 'Provider error: redacted');
  }
  return body;
}
