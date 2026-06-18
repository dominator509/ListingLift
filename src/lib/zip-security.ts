export function isZipSlipPath(entryName: string): boolean {
  const normalized = entryName.replace(/\\/g, '/');
  return (
    normalized.startsWith('/') ||
    normalized.includes('../') ||
    normalized === '..' ||
    /^[a-zA-Z]:\//.test(normalized)
  );
}

export function assertSafeZipEntry(entryName: string) {
  if (isZipSlipPath(entryName)) {
    throw new Error(`Unsafe ZIP entry rejected: ${entryName}`);
  }
}
