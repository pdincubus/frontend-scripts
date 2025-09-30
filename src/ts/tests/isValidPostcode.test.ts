import { describe, it, expect } from 'vitest';
import { isValidPostcode } from '../utilities/form/isValidPostcode';

describe('isValidPostcode', () => {
    // Valid classics from Royal Mail examples
    it('accepts standard valid postcodes', () => {
        expect(isValidPostcode('SW1A 1AA')).toBe(true); // Buckingham Palace
        expect(isValidPostcode('EC1A 1BB')).toBe(true);
        expect(isValidPostcode('W1A 0AX')).toBe(true);
        expect(isValidPostcode('M1 1AE')).toBe(true);
        expect(isValidPostcode('B33 8TH')).toBe(true);
        expect(isValidPostcode('CR2 6XH')).toBe(true);
        expect(isValidPostcode('DN55 1PT')).toBe(true);
    });

    it('accepts special-case GIR 0AA', () => {
        expect(isValidPostcode('GIR 0AA')).toBe(true);
        expect(isValidPostcode('gir0aa')).toBe(true);
    });

    it('allows optional single space before inward code', () => {
        expect(isValidPostcode('SW1A1AA')).toBe(true);
        expect(isValidPostcode('ec1a1bb')).toBe(true);
    });

    it('rejects obvious invalids', () => {
        expect(isValidPostcode('')).toBe(false);
        expect(isValidPostcode('123456')).toBe(false);
        expect(isValidPostcode('ABC DEF')).toBe(false);
        expect(isValidPostcode('SW1 1A')).toBe(false);      // too short inward
        expect(isValidPostcode('ZZ1A 1AA')).toBe(false);    // invalid area letters
        expect(isValidPostcode('SW1A 1A1')).toBe(false);    // wrong inward pattern
        expect(isValidPostcode('SW1A-1AA')).toBe(false);    // bad separator
    });

    it('is robust to non-string input', () => {
        // @ts-expect-error intentional
        expect(isValidPostcode(null)).toBe(false);
        // @ts-expect-error intentional
        expect(isValidPostcode(123 as any)).toBe(false);
    });
});