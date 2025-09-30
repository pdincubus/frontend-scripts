import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock deps exactly as the SUT imports them
vi.mock('../utilities/form/isValidName.js', () => ({
    isValidName: vi.fn()
}));
vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { isValidName } from '../utilities/form/isValidName.js';
import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import { validateName } from '../utilities/form/validateName';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('validateName (string API)', () => {
    const formId = 'firstName';

    it('returns true when isValidName is true', () => {
        (isValidName as vi.Mock).mockReturnValue(true);

        const result = validateName('Alice', formId);

        expect(result).toBe(true);
        expect(isValidName).toHaveBeenCalledWith('Alice');
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });

    it('returns false when isValidName is false', () => {
        (isValidName as vi.Mock).mockReturnValue(false);

        const result = validateName('1234', formId);

        expect(result).toBe(false);
        expect(isValidName).toHaveBeenCalledWith('1234');
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });

    it('trims whitespace and normalises curly apostrophes before validating', () => {
        (isValidName as vi.Mock).mockReturnValue(true);

        const result = validateName('   O’Connor   ', formId);

        expect(result).toBe(true);
        expect(isValidName).toHaveBeenCalledWith("O'Connor");
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });

    it('passes trimmed value to validator', () => {
        (isValidName as vi.Mock).mockReturnValue(true);

        validateName('   Bob   ', formId);

        expect(isValidName).toHaveBeenCalledWith('Bob');
    });
});