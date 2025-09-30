import { describe, it, expect, beforeEach, vi } from 'vitest';

// Dynamic mock for PasswordStrength.checkPassword
let mockCheck: (v: string) => any;
vi.mock('../global/PasswordStrength.js', () => ({
    PasswordStrength: vi.fn().mockImplementation(() => ({
        checkPassword: (v: string) => mockCheck(v)
    }))
}));

// Mock determineErrorDisplay exactly as imported
vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import { validatePasswordValue, validatePassword } from '../utilities/form/validatePassword';

beforeEach(() => {
    vi.clearAllMocks();
    // sensible default mock: valid, Good, score 50
    mockCheck = () => ({
        overallValues: { strength: 3, complexity: 'Good' },
        outputs: { isValid: true, score: 50 }
    });
});

describe('validatePasswordValue (pure)', () => {
    it('passes when PasswordStrength outputs isValid=true and meets minStrength', () => {
        const res = validatePasswordValue('Abc!2345');
        expect(res.ok).toBe(true);
        expect(res.strength).toBeGreaterThanOrEqual(3);
        expect(res.complexity).toBeDefined();
        expect(res.score).toBeGreaterThanOrEqual(0);
    });

    it('fails when PasswordStrength reports isValid=false', () => {
        mockCheck = () => ({
            overallValues: { strength: 2, complexity: 'Weak' },
            outputs: { isValid: false, score: 25 }
        });

        const res = validatePasswordValue('weak');
        expect(res.ok).toBe(false);
        expect(res.strength).toBe(2);
        expect(res.complexity).toBe('Weak');
        expect(res.score).toBe(25);
    });

    it('honours minStrength override, even if isValid=true', () => {
        // Simulate isValid true but only strength 2
        mockCheck = () => ({
            overallValues: { strength: 2, complexity: 'Weak' },
            outputs: { isValid: true, score: 35 }
        });

        const res = validatePasswordValue('borderline', { minStrength: 3 });
        expect(res.ok).toBe(false);
        expect(res.strength).toBe(2);
    });

    it('allows empty when not required', () => {
        const res = validatePasswordValue('', { required: false });
        expect(res.ok).toBe(true);
        expect(res.strength).toBe(0);
        expect(res.score).toBe(0);
    });
});

describe('validatePassword (wrapper)', () => {
    const formId = 'password';

    it('pipes boolean to determineErrorDisplay on success', () => {
        const ok = validatePassword(formId, 'Abc!2345');
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });

    it('pipes false to determineErrorDisplay on failure', () => {
        mockCheck = () => ({
            overallValues: { strength: 1, complexity: 'Very Weak' },
            outputs: { isValid: false, score: 5 }
        });

        const ok = validatePassword(formId, 'xx');
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });

    it('applies custom minStrength in wrapper', () => {
        mockCheck = () => ({
            overallValues: { strength: 3, complexity: 'Good' },
            outputs: { isValid: true, score: 55 }
        });
        // require Strong or better
        const ok = validatePassword(formId, 'Abc!2345', { minStrength: 4 });
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });
});