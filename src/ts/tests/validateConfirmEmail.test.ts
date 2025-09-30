import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import {
    validateConfirmEmailValue,
    validateConfirmEmail
} from '../utilities/form/validateConfirmEmail';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('validateConfirmEmailValue (pure)', () => {
    it('returns ok=true when emails match, case-insensitive by default', () => {
        const r = validateConfirmEmailValue('User@Example.com', 'user@example.com');
        expect(r.ok).toBe(true);
    });

    it('returns ok=false when emails differ', () => {
        const r = validateConfirmEmailValue('a@example.com', 'b@example.com');
        expect(r.ok).toBe(false);
    });

    it('trims values before comparing', () => {
        const r = validateConfirmEmailValue('  a@b.com ', 'a@b.com  ');
        expect(r.ok).toBe(true);
    });

    it('can be case sensitive when requested', () => {
        const r1 = validateConfirmEmailValue('User@Example.com', 'user@example.com', { caseSensitive: true });
        expect(r1.ok).toBe(false);
        const r2 = validateConfirmEmailValue('user@example.com', 'user@example.com', { caseSensitive: true });
        expect(r2.ok).toBe(true);
    });

    it('requires confirm when email present by default', () => {
        const r = validateConfirmEmailValue('a@b.com', '');
        expect(r.ok).toBe(false);
        expect(r.message).toBe('Confirm your email address.');
    });

    it('allows empty confirm if not required', () => {
        const r = validateConfirmEmailValue('a@b.com', '', { requiredIfEmailPresent: false });
        expect(r.ok).toBe(true);
    });

    it('returns ok=true when both empty, deferring requiredness to main email validator', () => {
        const r = validateConfirmEmailValue('', '');
        expect(r.ok).toBe(true);
    });
});

describe('validateConfirmEmail (wrapper)', () => {
    const formId = 'confirmEmail';

    it('pipes true to determineErrorDisplay on success', () => {
        const ok = validateConfirmEmail(formId, 'a@b.com', 'a@b.com');
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });

    it('pipes false to determineErrorDisplay on failure', () => {
        const ok = validateConfirmEmail(formId, 'a@b.com', 'nope@b.com');
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });

    it('honours options end to end', () => {
        const ok = validateConfirmEmail(formId, 'User@Example.com', 'user@example.com', { caseSensitive: true });
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenLastCalledWith(false, formId);
    });
});