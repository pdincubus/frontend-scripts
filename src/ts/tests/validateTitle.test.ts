import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock exactly as imported by the SUT
vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import { validateTitleValue, validateTitle } from '../utilities/form/validateTitle';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('validateTitleValue (pure)', () => {
    it('fails empty when required', () => {
        const r = validateTitleValue('');
        expect(r.ok).toBe(false);
        expect(r.message).toBe('Select a title.');
        expect(r.normalised).toBe('');
    });

    it('trims and normalises whitespace', () => {
        const r = validateTitleValue('  Dr   ');
        expect(r.ok).toBe(true);
        expect(r.normalised).toBe('Dr');
    });

    it('enforces default allow list', () => {
        const r = validateTitleValue('Your Majesty');
        expect(r.ok).toBe(false);
        expect(r.message).toBe('Select a valid title.');
    });

    it('accepts custom allow list', () => {
        const r = validateTitleValue('Captain', { allowList: ['Captain', 'Major'] });
        expect(r.ok).toBe(true);
        expect(r.normalised).toBe('Captain');
    });

    it('checks min and max length', () => {
        expect(validateTitleValue('M', { minLen: 2 }).ok).toBe(false);
        expect(validateTitleValue('X'.repeat(21), { maxLen: 20 }).ok).toBe(false);
    });

    it('rejects invalid characters via pattern', () => {
        const r = validateTitleValue('Dr<>');
        expect(r.ok).toBe(false);
        expect(r.message).toBe('Title contains invalid characters.');
    });

    it('allows empty when not required', () => {
        const r = validateTitleValue('', { required: false });
        expect(r.ok).toBe(true);
    });

    it('turns off allow list by passing empty list', () => {
        const r = validateTitleValue('Chief Troublemaker', { allowList: [] });
        expect(r.ok).toBe(true);
    });
});

describe('validateTitle (wrapper)', () => {
    const formId = 'title';

    it('pipes result to determineErrorDisplay, false on failure', () => {
        const ok = validateTitle(formId, '');
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledTimes(1);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });

    it('returns true and calls display on success', () => {
        const ok = validateTitle(formId, 'Ms');
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledTimes(1);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });

    it('honours custom rules end to end', () => {
        const ok = validateTitle(formId, 'Captain', { allowList: ['Captain'] });
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenLastCalledWith(true, formId);
    });
});