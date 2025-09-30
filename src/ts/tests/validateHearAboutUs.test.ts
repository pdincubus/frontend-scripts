import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock as imported by the SUT
vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import {
    validateHearAboutUsValue,
    validateHearAboutUs
} from '../utilities/form/validateHearAboutUs';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('validateHearAboutUsValue (pure)', () => {
    it('fails empty when required', () => {
        const r = validateHearAboutUsValue('');
        expect(r.ok).toBe(false);
        expect(r.message).toBe('Select how you heard about us.');
    });

    it('fails "NONE" case-insensitively when disallowNone is true', () => {
        const r = validateHearAboutUsValue('none');
        expect(r.ok).toBe(false);
        expect(r.message).toBe('Select a valid option.');
    });

    it('passes with a normal option', () => {
        const r = validateHearAboutUsValue('Google Search');
        expect(r.ok).toBe(true);
        expect(r.normalised).toBe('Google Search');
    });

    it('allows empty when not required', () => {
        const r = validateHearAboutUsValue('', { requiredWhenVisible: false });
        expect(r.ok).toBe(true);
    });

    it('allows "NONE" if disallowNone is false', () => {
        const r = validateHearAboutUsValue('NONE', { disallowNone: false });
        expect(r.ok).toBe(true);
    });

    it('trims input before checking', () => {
        const r = validateHearAboutUsValue('   Facebook   ');
        expect(r.ok).toBe(true);
        expect(r.normalised).toBe('Facebook');
    });
});

describe('validateHearAboutUs (wrapper)', () => {
    const formId = 'hearAboutUs';

    it('pipes to determineErrorDisplay when visible', () => {
        const ok = validateHearAboutUs(formId, 'Facebook', true);
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });

    it('reports false to determineErrorDisplay when visible and invalid', () => {
        const ok = validateHearAboutUs(formId, 'NONE', true);
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });

    it('does not call determineErrorDisplay when not visible', () => {
        const ok = validateHearAboutUs(formId, '', false);
        expect(ok).toBe(false); // still returns validity
        expect(determineErrorDisplay).not.toHaveBeenCalled();
    });

    it('honours custom rules', () => {
        const ok = validateHearAboutUs(formId, 'NONE', true, { disallowNone: false });
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });
});