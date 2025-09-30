import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../utilities/form/isValidPhone.js', () => ({
    isValidPhone: vi.fn()
}));
vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { isValidPhone } from '../utilities/form/isValidPhone.js';
import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import {
    normalisePhone,
    validatePhoneValue,
    validatePhone
} from '../utilities/form/validatePhone';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('normalisePhone', () => {
    it('removes spaces', () => {
        expect(normalisePhone('07123 456 789')).toBe('07123456789');
    });

    it('converts +44 prefix to 0', () => {
        expect(normalisePhone('+447123456789')).toBe('07123456789');
    });

    it('does not affect numbers without +44', () => {
        expect(normalisePhone('0123456789')).toBe('0123456789');
    });
});

describe('validatePhoneValue (pure)', () => {
    it('returns ok=true when isValidPhone passes', () => {
        (isValidPhone as vi.Mock).mockReturnValue(true);
        const res = validatePhoneValue('+44 7123 456 789');
        expect(res.ok).toBe(true);
        expect(res.normalised).toBe('07123456789');
        expect(isValidPhone).toHaveBeenCalledWith('07123456789');
    });

    it('returns ok=false when isValidPhone fails', () => {
        (isValidPhone as vi.Mock).mockReturnValue(false);
        const res = validatePhoneValue('badnumber');
        expect(res.ok).toBe(false);
        expect(res.normalised).toBe('badnumber');
    });

    it('can skip normalisation', () => {
        (isValidPhone as vi.Mock).mockReturnValue(true);
        const res = validatePhoneValue('+447123456789', { normalise: false });
        expect(res.ok).toBe(true);
        expect(res.normalised).toBe('+447123456789');
        expect(isValidPhone).toHaveBeenCalledWith('+447123456789');
    });
});

describe('validatePhone (wrapper)', () => {
    const formId = 'phone';

    it('pipes boolean to determineErrorDisplay', () => {
        (isValidPhone as vi.Mock).mockReturnValue(true);
        const ok = validatePhone(formId, '07123 456789');
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });

    it('calls determineErrorDisplay(false) on failure', () => {
        (isValidPhone as vi.Mock).mockReturnValue(false);
        const ok = validatePhone(formId, 'xxx');
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });
});