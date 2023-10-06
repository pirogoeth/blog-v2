import { createHash } from 'node:crypto';

export function digestText(text: string): string {
  const hasher = createHash('sha256');
  hasher.update(text);
  return hasher.digest('hex').toString();
}