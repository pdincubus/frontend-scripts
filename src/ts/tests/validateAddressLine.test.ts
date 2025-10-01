import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../utilities/form/isValidAddressLine.js', async () => {
    const actual = await vi.importActual<any>('../utilities/form/isValidAddressLine.js');
    return {
        ...actual,
        isValidAddressLine: vi.fn()
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

const isValidMock = isValidAddressLine as unknown as vi.MockedFunction<typeof isValidAddressLine>;
const displayMock = determineErrorDisplay as unknown as vi.MockedFunction<typeof determineErrorDisplay>;

beforeEach(() => {
    vi.clearAllMocks();
});

describe('normaliseAddressLine', () => {
    it('trims and collapses spaces', () => {
        expect(normaliseAddressLine('  10   Downing   Street  ')).toBe('10 Downing Street');
    });

    it('collapses tabs and mixed whitespace to single spaces', () => {
        expect(normaliseAddressLine('\tFlat   2,\t10   Downing\tSt')).toBe('Flat 2, 10 Downing St');
    });

    it('preserves allowed punctuation', () => {
        expect(normaliseAddressLine("Flat 2, O'Connor Court - A/B")).toBe("Flat 2, O'Connor Court - A/B");
    });
});

describe('validateAddressLineValue (pure)', () => {
    it('fails empty when required', () => {
        const r = validateAddressLineValue('');
        expect(r.ok).toBe(false);
        expect(isValidMock).not.toHaveBeenCalled();
    });

    it('passes empty when not required', () => {
        const r = validateAddressLineValue('', { required: false });
        expect(r.ok).toBe(true);
        expect(isValidMock).not.toHaveBeenCalled();
    });

    it('normalises then validates', () => {
        isValidMock.mockReturnValue(true);
        const r = validateAddressLineValue('  221B   Baker St ');
        expect(isValidMock).toHaveBeenCalledWith('221B Baker St');
        expect(r.ok).toBe(true);
        expect(r.normalised).toBe('221B Baker St');
    });

    it('reports invalid when underlying validator returns false', () => {
        isValidMock.mockReturnValue(false);
        const r = validateAddressLineValue('###');
        expect(r.ok).toBe(false);
    });

    it('enforces maxLength', () => {
        // underlying validator would pass, but maxLength should fail first
        isValidMock.mockReturnValue(true);
        const r = validateAddressLineValue('A'.repeat(51), { maxLength: 50 });
        expect(r.ok).toBe(false);
        // validator should not be consulted when over max length
        expect(isValidMock).not.toHaveBeenCalled();
    });

    it('rejects control characters', () => {
        // let the underlying validator say true so we prove the pure check blocks it
        isValidMock.mockReturnValue(true);
        const r = validateAddressLineValue('Flat 1 \u0007'); // BEL control char
        expect(r.ok).toBe(false);
    });
});

describe('validateAddressLine (wrapper)', () => {
    it('pipes success to determineErrorDisplay', () => {
        isValidMock.mockReturnValue(true);
        const ok = validateAddressLine('address_1', 'Flat 2, 10 Downing St');
        expect(ok).toBe(true);
        expect(displayMock).toHaveBeenCalledWith(true, 'address_1');
    });

    it('pipes failure to determineErrorDisplay', () => {
        isValidMock.mockReturnValue(false);
        const ok = validateAddressLine('address_1', '###');
        expect(ok).toBe(false);
        expect(displayMock).toHaveBeenCalledWith(false, 'address_1');
    });

    it('treats empty as valid when not required and skips validator', () => {
        isValidMock.mockReturnValue(false);
        const ok = validateAddressLine('address_2', '', { required: false });
        expect(ok).toBe(true);
        expect(displayMock).toHaveBeenCalledWith(true, 'address_2');
        expect(isValidMock).not.toHaveBeenCalled();
    });

    it('respects custom maxLength at wrapper level', () => {
        isValidMock.mockReturnValue(true);
        const ok = validateAddressLine('address_3', 'X'.repeat(30), { maxLength: 20 });
        expect(ok).toBe(false);
        expect(displayMock).toHaveBeenCalledWith(false, 'address_3');
    });
});