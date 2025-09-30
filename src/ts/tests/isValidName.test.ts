import { describe, it, expect } from 'vitest';
import { isValidName } from '../utilities/form/isValidName';

describe('isValidName (Unicode letters, spaces, dot, apostrophe, hyphen)', () => {
  it('accepts simple names', () => {
    expect(isValidName('Alice')).toBe(true);
    expect(isValidName('Bob Smith')).toBe(true);
  });

  it('accepts names with apostrophes, hyphens, and dots', () => {
    expect(isValidName("O'Connor")).toBe(true);
    expect(isValidName('Jean-Luc')).toBe(true);
    expect(isValidName('Dr. Smith')).toBe(true);
  });

  it('accepts names with accented and non-ASCII letters', () => {
    expect(isValidName('Élodie')).toBe(true);
    expect(isValidName('Łukasz')).toBe(true);
    expect(isValidName('José María')).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    expect(isValidName('  Alice ')).toBe(true);
  });

  it('rejects digits and other symbols', () => {
    expect(isValidName('John3')).toBe(false);
    expect(isValidName('Mary_Ann')).toBe(false); // underscore not allowed
    expect(isValidName('Alice!')).toBe(false);
    expect(isValidName('Jane@Doe')).toBe(false);
  });

  it('rejects empty or whitespace-only', () => {
    expect(isValidName('')).toBe(false);
    expect(isValidName('   ')).toBe(false);
  });

  it('rejects emoji and non-letter symbols', () => {
    expect(isValidName('🙂')).toBe(false);
    expect(isValidName('Lee 🔥')).toBe(false);
  });

  it('guards non-string input', () => {
    // @ts-expect-error robustness
    expect(isValidName(null)).toBe(false);
    // @ts-expect-error robustness
    expect(isValidName(123)).toBe(false);
  });
});