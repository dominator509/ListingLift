export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function isExpired(date: Date | null | undefined): boolean {
  if (!date) return true;
  return date.getTime() <= Date.now();
}
