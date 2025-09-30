import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../utilities/form/isValidAddressLine.js', async () => {
    const actual = await vi.importActual<any>('../utilities/form/isValidAddressLine.js');
    return {
        ...actual,
        isValidAddressLine: vi.fn() // stub only this, keep normaliseAddressLine real
    };
});

vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { isValidAddressLine } from '../utilities/form/isValidAddressLine.js';
import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import {
    normaliseAddressLine,
    validateAddressLineValue,
    validateAddressLine
} from '../utilities/form/validateAddressLine';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('normaliseAddressLine', () => {
    it('trims and collapses spaces', () => {
        expect(normaliseAddressLine('  10   Downing   Street  ')).toBe('10 Downing Street');
    });
});

describe('validateAddressLineValue (pure)', () => {
    it('fails empty when required', () => {
        const r = validateAddressLineValue('');
        expect(r.ok).toBe(false);
        expect(isValidAddressLine).not.toHaveBeenCalled();
    });

    it('passes empty when not required', () => {
        const r = validateAddressLineValue('', { required: false });
        expect(r.ok).toBe(true);
    });

    it('normalises then validates', () => {
        (isValidAddressLine as vi.Mock).mockReturnValue(true);
        const r = validateAddressLineValue('  221B   Baker St ');
        expect(isValidAddressLine).toHaveBeenCalledWith('221B Baker St');
        expect(r.ok).toBe(true);
        expect(r.normalised).toBe('221B Baker St');
    });

    it('reports invalid from isValidAddressLine', () => {
        (isValidAddressLine as vi.Mock).mockReturnValue(false);
        const r = validateAddressLineValue('###');
        expect(r.ok).toBe(false);
    });
});

describe('validateAddressLine (wrapper)', () => {
    it('pipes to determineErrorDisplay', () => {
        (isValidAddressLine as vi.Mock).mockReturnValue(true);
        const ok = validateAddressLine('address_1', 'Flat 2, 10 Downing St');
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, 'address_1');
    });
});