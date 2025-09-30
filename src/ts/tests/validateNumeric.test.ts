import { describe, it, expect } from 'vitest';
import { validateNumeric } from '../utilities/form/validateNumeric';

describe('validateNumeric', () => {
    it('accepts simple integers', () => {
        expect(validateNumeric('0')).toBe(true);
        expect(validateNumeric('123')).toBe(true);
    });

    it('accepts with leading/trailing whitespace', () => {
        expect(validateNumeric('   42')).toBe(true);
        expect(validateNumeric('99   ')).toBe(true);
        expect(validateNumeric('   7   ')).toBe(true);
    });

    it('rejects decimals and floats', () => {
        expect(validateNumeric('1.23')).toBe(false);
        expect(validateNumeric('3,000')).toBe(false);
    });

    it('rejects non-digit characters', () => {
        expect(validateNumeric('abc')).toBe(false);
        expect(validateNumeric('123a')).toBe(false);
        expect(validateNumeric('a123')).toBe(false);
    });

    it('rejects empty string or whitespace only', () => {
        expect(validateNumeric('')).toBe(false);
        expect(validateNumeric('   ')).toBe(false);
    });

    it('rejects non-string input', () => {
        // @ts-expect-error testing robustness
        expect(validateNumeric(123)).toBe(false);
        // @ts-expect-error testing robustness
        expect(validateNumeric(null)).toBe(false);
    });
});