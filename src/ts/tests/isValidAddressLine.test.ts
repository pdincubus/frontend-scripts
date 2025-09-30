import { describe, it, expect } from 'vitest';
import {
    isValidAddressLine,
    normaliseAddressLine
} from '../utilities/form/isValidAddressLine';

describe('normaliseAddressLine', () => {
    it('trims and collapses whitespace', () => {
        expect(normaliseAddressLine('  10   Downing   Street  ')).toBe('10 Downing Street');
    });

    it('can skip collapsing and trimming', () => {
        expect(normaliseAddressLine('  A   B  ', false, false)).toBe('  A   B  ');
    });
});

describe('isValidAddressLine', () => {
    it('accepts common UK addresses', () => {
        expect(isValidAddressLine('10 Downing Street').ok).toBe(true);
        expect(isValidAddressLine('Flat 2, 221B Baker St.').ok).toBe(true);
        expect(isValidAddressLine("O'Connell Street").ok).toBe(true);
        expect(isValidAddressLine('The Barn (Rear), High St').ok).toBe(true);
        expect(isValidAddressLine('Unit 4A/5B').ok).toBe(true);
        expect(isValidAddressLine('5-7 King’s Road').ok).toBe(true);
    });

    it('accepts Unicode letters', () => {
        expect(isValidAddressLine('Ångströmvägen 3').ok).toBe(true);
        expect(isValidAddressLine('Łódź 12').ok).toBe(true);
        expect(isValidAddressLine('Élysée, Avenue').ok).toBe(true);
    });

    it('enforces min and max length', () => {
        expect(isValidAddressLine('', { minLength: 1 }).ok).toBe(false);
        expect(isValidAddressLine('A', { minLength: 2 }).ok).toBe(false);
        const long = 'x'.repeat(101);
        const r = isValidAddressLine(long, { maxLength: 100 });
        expect(r.ok).toBe(false);
        expect(r.message).toBe('Use at most 100 characters.');
    });

    it('allows empty when not required', () => {
        expect(isValidAddressLine('', { required: false }).ok).toBe(true);
    });

    it('rejects unsupported characters', () => {
        expect(isValidAddressLine('Drop @ neighbour').ok).toBe(false);
        expect(isValidAddressLine('HTML <b>bold</b>').ok).toBe(false);
        expect(isValidAddressLine('Emoji 😀 Lane').ok).toBe(false);
        expect(isValidAddressLine('Tab\tStreet').ok).toBe(false);
    });
});