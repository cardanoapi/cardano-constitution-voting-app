import crypto from 'node:crypto';

/**
 * Generate a cryptographically secure random hex string
 * @param byteCount - Number of random bytes to generate
 * @returns Cryptographically secure random hex string
 */
export const secureRandom = (byteCount: number): string =>
  crypto.randomBytes(byteCount).toString('hex');
