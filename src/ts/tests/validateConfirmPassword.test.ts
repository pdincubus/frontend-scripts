import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import {
    validateConfirmPasswordValue,
    validateConfirmPassword
} from '../utilities/form/validateConfirmPassword';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('validateConfirmPasswordValue (pure)', () => {
    it('returns ok=true when passwords match exactly', () => {
        expect(validateConfirmPasswordValue('Secret123!', 'Secret123!').ok).toBe(true);
    });

    it('returns ok=false when passwords differ', () => {
        expect(validateConfirmPasswordValue('Secret123!', 'Secret123?').ok).toBe(false);
    });

    it('trims whitespace by default', () => {
        expect(validateConfirmPasswordValue('  a  ', 'a').ok).toBe(true);
        expect(validateConfirmPasswordValue('a', '  a  ').ok).toBe(true);
    });

    it('respects caseSensitive=false', () => {
        expect(
            validateConfirmPasswordValue('Password', 'password', { caseSensitive: false }).ok
        ).toBe(true);
        expect(
            validateConfirmPasswordValue('Password', 'password', { caseSensitive: true }).ok
        ).toBe(false);
    });

    it('fails empty confirm when required', () => {
        const r = validateConfirmPasswordValue('x', '', { required: true });
        expect(r.ok).toBe(false);
        expect(r.message).toBe('Confirm your password.');
    });

    it('allows empty confirm when not required', () => {
        expect(validateConfirmPasswordValue('x', '', { required: false }).ok).toBe(true);
    });
});

describe('validateConfirmPassword (wrapper)', () => {
    const formId = 'confirmPassword';

    it('pipes true to determineErrorDisplay on success', () => {
        const ok = validateConfirmPassword(formId, 'Secret123!', 'Secret123!');
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });

    it('pipes false to determineErrorDisplay on failure', () => {
        const ok = validateConfirmPassword(formId, 'Secret123!', 'nope');
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });

    it('honours options end to end', () => {
        const ok = validateConfirmPassword(formId, 'Foo', ' foo ', { trim: true, caseSensitive: false });
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenLastCalledWith(true, formId);
    });
});