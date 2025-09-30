import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock exactly as imported by the SUT
vi.mock('../utilities/form/isValidEmail.js', () => ({
    isValidEmail: vi.fn()
}));
vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { isValidEmail } from '../utilities/form/isValidEmail.js';
import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import { validateEmailValue, validateEmail } from '../utilities/form/validateEmail';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('validateEmailValue (pure)', () => {
    it('trims and lowercases before validating', () => {
        (isValidEmail as vi.Mock).mockReturnValue(true);

        const res = validateEmailValue('  USER+tag@Example.CO.UK  ');
        expect(isValidEmail).toHaveBeenCalledWith('user+tag@example.co.uk');
        expect(res.ok).toBe(true);
        expect(res.normalised).toBe('user+tag@example.co.uk');
    });

    it('can skip normalisation options', () => {
        (isValidEmail as vi.Mock).mockReturnValue(true);

        const res = validateEmailValue('  USER@EXAMPLE.COM  ', { trim: false, toLowerCase: false });
        expect(isValidEmail).toHaveBeenCalledWith('  USER@EXAMPLE.COM  ');
        expect(res.normalised).toBe('  USER@EXAMPLE.COM  ');
    });

    it('returns ok=false and a message when invalid', () => {
        (isValidEmail as vi.Mock).mockReturnValue(false);

        const res = validateEmailValue('not-an-email');
        expect(res.ok).toBe(false);
        expect(res.message).toBe('Enter a valid email address.');
        expect(res.normalised).toBe('not-an-email');
    });
});

describe('validateEmail (wrapper)', () => {
    const formId = 'email';

    it('pipes true to determineErrorDisplay on success', () => {
        (isValidEmail as vi.Mock).mockReturnValue(true);

        const ok = validateEmail(formId, 'user@example.com');
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });

    it('pipes false to determineErrorDisplay on failure', () => {
        (isValidEmail as vi.Mock).mockReturnValue(false);

        const ok = validateEmail(formId, 'nope');
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });
});