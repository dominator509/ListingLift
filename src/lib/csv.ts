const formulaPrefixes = ['=', '+', '-', '@', '\t', '\r'];

export function neutralizeCsvFormula(value: string) {
  if (formulaPrefixes.some((prefix) => value.startsWith(prefix))) {
    return `'${value}`;
  }
  return value;
}

export const neutralizeCsvCell = neutralizeCsvFormula;

export function safeCsvCell(value: unknown) {
  if (value == null) return '';
  return neutralizeCsvFormula(String(value));
}
