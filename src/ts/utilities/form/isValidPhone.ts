/**
 * Validate a UK phone number.
 *
 * Defaults:
 * - Accept domestic 0-prefixed format only
 * - Any type (mobile or not)
 *
 * Options:
 * - type: 'any' | 'mobile' | 'landline'
 *   - 'mobile' matches real UK mobile ranges:
 *     071–075, 077–079, plus 07624 (Isle of Man)
 *     Excludes 070 personal numbers.
 *   - 'landline' means “valid UK number that is not mobile”
 * - allowInternational: also accept +44, normalised to 0
 * - allowBareCountryCode: also accept 44xxxxxxxxxx, normalised to 0
 */
export function isValidPhone(
  value: string,
  opts: {
    type?: 'any' | 'mobile' | 'landline';
    allowInternational?: boolean;
    allowBareCountryCode?: boolean;
  } = {}
): boolean {
  const {
    type = 'any',
    allowInternational = false,
    allowBareCountryCode = false
  } = opts;

  if (typeof value !== 'string') return false;

  let v = value.trim();

  // Normalise +44 → 0 if allowed
  if (allowInternational && v.startsWith('+44')) {
    v = '0' + v.slice(3);
  }

  // Normalise bare 44 → 0 if allowed
  if (allowBareCountryCode && !v.startsWith('+') && v.startsWith('44')) {
    v = '0' + v.slice(2);
  }

  // Remove spaces
  v = v.replace(/\s+/g, '');

  // Basic shape: 10 or 11 digits, starts with 0
  if (!/^0\d{9,10}$/.test(v)) return false;

  // Broad UK ranges: landline and non-geo and mobiles
  const validAnyPrefix = /^(01|02|03|07|08|09)/;
  if (!validAnyPrefix.test(v)) return false;

  // Mobile check: 071–075, 077–079, and 07624 specifically
  const isMobile =
    /^0(7([1-57-9])\d{8}|7624\d{6})$/.test(v);

  if (type === 'mobile') return isMobile;
  if (type === 'landline') return !isMobile;

  return true;
}

/**
 * Deprecated. Use isValidPhone(value, { type: 'mobile', ...flags }).
 */
export function isValidMobilePhone(value: string): boolean {
  return isValidPhone(value, { type: 'mobile' });
}