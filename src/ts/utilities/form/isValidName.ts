export function isValidName(value: string): boolean {
  if (typeof value !== 'string') return false;
  return /^[\p{L} .'-]+$/u.test(value.trim());
}