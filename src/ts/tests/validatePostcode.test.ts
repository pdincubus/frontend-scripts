import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock exactly as the SUT imports them
vi.mock('../utilities/form/isValidPostcode.js', () => ({
    isValidPostcode: vi.fn()
}));
vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { isValidPostcode } from '../utilities/form/isValidPostcode.js';
import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import {
    validatePostcodeValue,
    validatePostcode,
    normaliseUkPostcode
} from '../utilities/form/validatePostcode';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('normaliseUkPostcode', () => {
    it('uppercases and inserts a single space before last 3 characters', () => {
        expect(normaliseUkPostcode('sw1a1aa')).toBe('SW1A 1AA');
        expect(normaliseUkPostcode(' Ec1a1BB ')).toBe('EC1A 1BB');
    });

    it('leaves too-short values unchanged apart from uppercasing and space removal', () => {
        expect(normaliseUkPostcode(' w1 ')).toBe('W1');
        expect(normaliseUkPostcode('ab3')).toBe('AB3');
    });
});

describe('validatePostcodeValue (pure)', () => {
    it('fails empty when required', () => {
        const res = validatePostcodeValue('');
        expect(res.ok).toBe(false);
        expect(res.message).toBe('Enter a postcode.');
        expect(res.normalised).toBe('');
        expect(isValidPostcode).not.toHaveBeenCalled();
    });

    it('passes empty when not required', () => {
        const res = validatePostcodeValue('', { required: false });
        expect(res.ok).toBe(true);
        expect(isValidPostcode).not.toHaveBeenCalled();
    });

    it('normalises before validating and passes the normalised value to isValidPostcode', () => {
        (isValidPostcode as vi.Mock).mockReturnValue(true);
        const res = validatePostcodeValue(' sw1a1aa ');
        expect(isValidPostcode).toHaveBeenCalledWith('SW1A 1AA');
        expect(res.ok).toBe(true);
        expect(res.normalised).toBe('SW1A 1AA');
    });

    it('can disable normalisation if asked', () => {
        (isValidPostcode as vi.Mock).mockReturnValue(true);
        const res = validatePostcodeValue('sw1a1aa', { normalise: false });
        expect(isValidPostcode).toHaveBeenCalledWith('sw1a1aa');
        expect(res.ok).toBe(true);
        expect(res.normalised).toBe('sw1a1aa');
    });

    it('returns a helpful message on invalid format', () => {
        (isValidPostcode as vi.Mock).mockReturnValue(false);
        const res = validatePostcodeValue('XX1 1ZZ');
        expect(res.ok).toBe(false);
        expect(res.message).toBe('Enter a valid UK postcode.');
        expect(res.normalised).toBe('XX1 1ZZ');
    });
});

describe('validatePostcode (wrapper)', () => {
    const formId = 'postcode';

    it('pipes boolean to determineErrorDisplay and returns it', () => {
        (isValidPostcode as vi.Mock).mockReturnValue(true);
        const ok = validatePostcode(formId, 'sw1a1aa');
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });

    it('calls determineErrorDisplay(false) on failure', () => {
        (isValidPostcode as vi.Mock).mockReturnValue(false);
        const ok = validatePostcode(formId, 'badcode');
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });

    it('does not call isValidPostcode for required empty, still reports error', () => {
        const ok = validatePostcode(formId, '');
        expect(ok).toBe(false);
        expect(isValidPostcode).not.toHaveBeenCalled();
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });
});