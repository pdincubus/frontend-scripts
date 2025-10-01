import { describe, it, expect } from 'vitest';
import { isValidPhone } from '../utilities/form/isValidPhone';

describe('isValidPhone defaults (any, domestic only)', () => {
  it('accepts domestic landlines and mobiles', () => {
    expect(isValidPhone('02079460000')).toBe(true);       // London
    expect(isValidPhone('0113 496 0000')).toBe(true);     // Leeds
    expect(isValidPhone('07123 456789')).toBe(true);      // mobile
  });

  it('rejects +44 and bare 44 by default', () => {
    expect(isValidPhone('+447912345678')).toBe(false);
    expect(isValidPhone('447912345678')).toBe(false);
  });

  it('rejects junk', () => {
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone('07123abc789')).toBe(false);
    expect(isValidPhone('00123456789')).toBe(false);
  });
});

describe('isValidPhone with international flags', () => {
  it("accepts +44 when allowInternational is true", () => {
    expect(isValidPhone("+447912345678", { allowInternational: true })).toBe(true);
    expect(isValidPhone("+44 20 7946 0000", { allowInternational: true })).toBe(true);
    expect(isValidPhone("+44 7911 123 456", { allowInternational: true })).toBe(true);
    // reject +44 with local 0 after country code
    expect(isValidPhone("+44 07911 123 456", { allowInternational: true })).toBe(false);
  });

  it('accepts UK landline 020 format', () => {
      expect(isValidPhone('020 7946 0958')).toBe(true);
  });

  it('accepts +44 mobile when allowInternational', () => {
      expect(isValidPhone('+44 7911 123456', { allowInternational: true })).toBe(true);
  });

  it('rejects mixed +44 with leading 0', () => {
      expect(isValidPhone('+44 07911 123456', { allowInternational: true })).toBe(false);
  });

  it('accepts bare 44 when allowBareCountryCode is true', () => {
    expect(isValidPhone('447912345678', { allowBareCountryCode: true })).toBe(true);
    expect(isValidPhone('44 20 7946 0000', { allowBareCountryCode: true })).toBe(true);
  });

  it('accepts either when both flags are set', () => {
    const opts = { allowInternational: true, allowBareCountryCode: true };
    expect(isValidPhone('+447700900123', opts)).toBe(true);
    expect(isValidPhone('447700900123', opts)).toBe(true);
  });
});

describe('isValidPhone type filters', () => {
  it('type: mobile accepts real mobile ranges', () => {
    expect(isValidPhone('07123456789', { type: 'mobile' })).toBe(true);
    expect(isValidPhone('07912 345678', { type: 'mobile' })).toBe(true);
    // 07624 Isle of Man mobile
    expect(isValidPhone('07624 123456', { type: 'mobile' })).toBe(true);
  });

  it('type: mobile rejects non-mobile including 070 personal numbers', () => {
    expect(isValidPhone('07012345678', { type: 'mobile' })).toBe(false);
    expect(isValidPhone('02079460000', { type: 'mobile' })).toBe(false);
    expect(isValidPhone('03001234567', { type: 'mobile' })).toBe(false);
  });

  it('type: landline rejects mobiles and accepts non-mobile ranges', () => {
    expect(isValidPhone('02079460000', { type: 'landline' })).toBe(true);
    expect(isValidPhone('03001234567', { type: 'landline' })).toBe(true);
    expect(isValidPhone('0800123456', { type: 'landline' })).toBe(true);
    expect(isValidPhone('07123456789', { type: 'landline' })).toBe(false);
    expect(isValidPhone('07624 123456', { type: 'landline' })).toBe(false);
  });
});

describe('isValidPhone (deprecated shim)', () => {
  it('respects type: mobile', () => {
    expect(isValidPhone('07123456789', { type: 'mobile' })).toBe(true);
    expect(isValidPhone('02079460000', { type: 'mobile' })).toBe(false);
  });
});