import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../utilities/form/isValidEmail';

describe('isValidEmail', () => {
  it('accepts common valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('USER@EXAMPLE.COM')).toBe(true);
    expect(isValidEmail('first.last@example.co.uk')).toBe(true);
    expect(isValidEmail('user+tag@sub.example.org')).toBe(true);
    expect(isValidEmail('o\'connor@mail.ie')).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true);
  });

  it('rejects consecutive dots or edge dots in local part', () => {
    expect(isValidEmail('.user@example.com')).toBe(false);
    expect(isValidEmail('user.@example.com')).toBe(false);
    expect(isValidEmail('u..ser@example.com')).toBe(false);
  });

  it('rejects invalid domain label shapes', () => {
    expect(isValidEmail('user@-example.com')).toBe(false);    // leading hyphen
    expect(isValidEmail('user@example-.com')).toBe(false);    // trailing hyphen
    expect(isValidEmail('user@exa..mple.com')).toBe(false);   // empty label
    expect(isValidEmail('user@example.c')).toBe(false);       // tld too short
  });

  it('accepts long but sane TLDs up to 24 chars', () => {
    expect(isValidEmail('user@example.technology')).toBe(true);
  });

  it('rejects overlong TLDs', () => {
    expect(isValidEmail('user@example.' + 'a'.repeat(25))).toBe(false);
  });

  it('rejects missing parts and obvious junk', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('guards non string input', () => {
    // @ts-expect-error robustness
    expect(isValidEmail(null)).toBe(false);
    // @ts-expect-error robustness
    expect(isValidEmail(123)).toBe(false);
  });
});