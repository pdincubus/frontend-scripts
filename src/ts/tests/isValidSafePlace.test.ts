import { describe, it, expect } from 'vitest';
import { isValidSafePlace } from '../utilities/form/isValidSafePlace';

function input(value: string): HTMLInputElement {
  const el = document.createElement('input');
  el.value = value;
  return el;
}

describe('isValidSafePlace', () => {
  it('returns true when selector is not "Z:Other", regardless of text', () => {
    expect(isValidSafePlace('', input('FrontDoor'))).toBe(true);
    expect(isValidSafePlace('anything at all', input('Porch'))).toBe(true);
  });

  it('returns false when "Z:Other" and text is empty', () => {
    expect(isValidSafePlace('', input('Z:Other'))).toBe(false);
  });

  it('returns true when "Z:Other" and text has only allowed characters', () => {
    // letters, numbers, spaces, hyphen, apostrophe
    expect(isValidSafePlace("Shed 2 - neighbour's", input('Z:Other'))).toBe(true);
    expect(isValidSafePlace('Back garden gate', input('Z:Other'))).toBe(true);
    expect(isValidSafePlace("O'Reilly 12", input('Z:Other'))).toBe(true);
  });

  it('returns false when "Z:Other" and text contains disallowed characters', () => {
    expect(isValidSafePlace('behind, bins', input('Z:Other'))).toBe(false);   // comma
    expect(isValidSafePlace('porch!', input('Z:Other'))).toBe(false);         // exclamation
    expect(isValidSafePlace('gate/', input('Z:Other'))).toBe(false);          // slash
    expect(isValidSafePlace('line\nbreak', input('Z:Other'))).toBe(false);    // newline
    expect(isValidSafePlace('tab\tchar', input('Z:Other'))).toBe(false);      // tab
  });

  it('treats leading and trailing spaces as fine if all chars are allowed', () => {
    expect(isValidSafePlace('  shed  ', input('Z:Other'))).toBe(true);
  });
});