import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export function assertPasswordPolicy(password: string): void {
  if (!password || password.length < 12) {
    throw new Error('Password must be at least 12 characters');
  }

  // Q15-H3: Require 3 of 4 character classes (upper, lower, digit, special)
  let classCount = 0;
  if (/[A-Z]/.test(password)) classCount++;
  if (/[a-z]/.test(password)) classCount++;
  if (/[0-9]/.test(password)) classCount++;
  if (/[^A-Za-z0-9]/.test(password)) classCount++;

  if (classCount < 3) {
    throw new Error('Password must include at least 3 of: uppercase, lowercase, digit, special character');
  }
}

export function normalizeEmail(email: string): string {
  if (email == null) throw new Error('Email is required');
  if (email === '') return '';
  const trimmed = email.trim().toLowerCase();
  return trimmed;
}

export function redactUserForAuth<T extends { passwordHash?: string | null }>(user: T): Omit<T, 'passwordHash'> {
  const { passwordHash, ...rest } = user;
  return rest as Omit<T, 'passwordHash'>;
}

export async function hashPassword(password: string): Promise<string> {
  assertPasswordPolicy(password);
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string | null | undefined): Promise<boolean> {
  if (!hash) return false;
  try {
    // P22: bcrypt.compare uses internal timing-safe comparison — no timing oracle leak
    return bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}
