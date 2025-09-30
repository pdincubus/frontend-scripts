import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import { isPostcode, isPostcodeValue, normalisePostcode } from '../utilities/form/isPostcode';

describe('normalisePostcode', () => {
    it('uppercases, trims, and inserts a single space', () => {
        expect(normalisePostcode('sw1a1aa')).toBe('SW1A 1AA');
        expect(normalisePostcode('  ec1a   1bb ')).toBe('EC1A 1BB');
    });

    it('returns empty for non string', () => {
        // @ts-expect-error robustness
        expect(normalisePostcode(null)).toBe('');
    });
});

describe('isPostcodeValue (pure)', () => {
    it('validates and returns normalised form', () => {
        const res = isPostcodeValue('sw1a1aa');
        expect(res.normalised).toBe('SW1A 1AA');
        expect(res.ok).toBe(true);
    });

    it('fails clearly for invalid', () => {
        const res = isPostcodeValue('INVALID');
        expect(res.ok).toBe(false);
    });
});

describe('isPostcode (wrapper)', () => {
    const fieldId = 'postCode';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('reports true for valid values', () => {
        const ok = isPostcode(fieldId, 'EC1A 1BB');
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, fieldId);
    });

    it('reports false for invalid values', () => {
        const ok = isPostcode(fieldId, 'ZZ1 1ZZ');
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, fieldId);
    });
});