import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import {
    validateDeliveryInstructionsValue,
    validateDeliveryInstructions
} from '../utilities/form/isValidDeliveryInstructions';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('validateDeliveryInstructionsValue (pure)', () => {
    it('passes empty when not required', () => {
        const r = validateDeliveryInstructionsValue('');
        expect(r.ok).toBe(true);
    });

    it('fails empty when required', () => {
        const r = validateDeliveryInstructionsValue('', { required: true });
        expect(r.ok).toBe(false);
        expect(r.message).toBe('Enter delivery instructions.');
    });

    it('accepts common punctuation and new lines', () => {
        const text = "Leave in shed.\nBehind gate, code 1234.\nRing bell if needed.";
        const r = validateDeliveryInstructionsValue(text);
        expect(r.ok).toBe(true);
    });

    it('rejects angle brackets and control chars', () => {
        expect(validateDeliveryInstructionsValue('<script>alert(1)</script>').ok).toBe(false);
        expect(validateDeliveryInstructionsValue('tab\tchar').ok).toBe(false);
        expect(validateDeliveryInstructionsValue('<script>').ok).toBe(false);
        expect(validateDeliveryInstructionsValue('foo\x01bar').ok).toBe(false);
        expect(validateDeliveryInstructionsValue('Café\nau lait').ok).toBe(true);
    });

    it('enforces max length', () => {
        const long = 'x'.repeat(501);
        const r = validateDeliveryInstructionsValue(long, { maxLength: 500 });
        expect(r.ok).toBe(false);
        expect(r.message).toBe('Use at most 500 characters.');
    });

    it('enforces min length when set', () => {
        const r = validateDeliveryInstructionsValue('Hi', { required: true, minLength: 5 });
        expect(r.ok).toBe(false);
        expect(r.message).toBe('Enter at least 5 characters.');
    });

    it('trims by default', () => {
        const r = validateDeliveryInstructionsValue('   Back gate   ', { required: true, minLength: 4 });
        expect(r.ok).toBe(true);
        expect(r.normalised).toBe('Back gate');
    });
});

describe('validateDeliveryInstructions (wrapper)', () => {
    const formId = 'deliveryInstructions';

    it('pipes true to determineErrorDisplay on success', () => {
        const ok = validateDeliveryInstructions(formId, 'Leave with neighbour.');
        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenCalledWith(true, formId);
    });

    it('pipes false to determineErrorDisplay on failure', () => {
        const ok = validateDeliveryInstructions(formId, '<nope>');
        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, formId);
    });
});