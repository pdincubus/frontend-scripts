import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the display helper as imported by the SUT
vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import { validateDateValue, validateDate } from '../utilities/form/validateDate';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('validateDateValue (pure)', () => {
    const now = new Date('2025-09-30T12:00:00Z'); // fixed "today" for determinism

    it('fails when any required part is empty', () => {
        const r = validateDateValue('', '1', '2000', { now });
        expect(r.ok).toBe(false);
        expect(r.dayOk).toBe(false);
        expect(r.monthOk).toBe(true);
        expect(r.yearOk).toBe(true);
    });

    it('rejects impossible calendar dates', () => {
        const r = validateDateValue('31', '2', '2024', { now });
        expect(r.ok).toBe(false);
        expect(r.dayOk).toBe(false);
        expect(r.monthOk).toBe(false);
        expect(r.yearOk).toBe(false);
    });

    it('accepts a valid date that is at least minAge', () => {
        const r = validateDateValue('15', '01', '2000', { now, minAge: 18 });
        expect(r.ok).toBe(true);
        expect(r.dayOk && r.monthOk && r.yearOk).toBe(true);
    });

    it('accepts 29 February on a leap year, rejects on non-leap year', () => {
        const leap = validateDateValue('29', '02', '2004', { now });
        expect(leap.ok).toBe(true);
        const nonLeap = validateDateValue('29', '02', '2003', { now });
        expect(nonLeap.ok).toBe(false);
    });

    it('enforces minAge boundary precisely', () => {
        // On 2025-09-30, someone born 2007-10-01 is still under 18
        const under = validateDateValue('01', '10', '2007', { now, minAge: 18 });
        expect(under.ok).toBe(false);

        // Born 2007-09-30 is exactly 18 today
        const exact = validateDateValue('30', '09', '2007', { now, minAge: 18 });
        expect(exact.ok).toBe(true);
    });

    it('enforces maxAge when provided', () => {
        const tooOld = validateDateValue('01', '01', '1890', { now, maxAge: 120 });
        expect(tooOld.ok).toBe(false);
    });
});

describe('validateDate (wrapper)', () => {
    const now = new Date('2025-09-30T12:00:00Z');
    const ids = { d: 'dob-day', m: 'dob-month', y: 'dob-year' };

    it('pipes individual and overall flags to determineErrorDisplay and returns true for valid date', () => {
        const ok = validateDate(ids.d, ids.m, ids.y, '30', '09', '2000', { now, minAge: 18 });
        expect(ok).toBe(true);

        const calls = (determineErrorDisplay as unknown as vi.Mock).mock.calls;
        // Expect 4 calls: day, month, year, overall
        expect(calls.length).toBe(4);
        expect(calls[0]).toEqual([true, ids.d]);
        expect(calls[1]).toEqual([true, ids.m]);
        expect(calls[2]).toEqual([true, ids.y]);
        expect(calls[3]).toEqual([true, ids.y]); // overall uses year id, matching legacy behaviour
    });

    it('returns false for invalid, marking all parts and overall', () => {
        const ok = validateDate(ids.d, ids.m, ids.y, '31', '02', '2024', { now });
        expect(ok).toBe(false);

        const calls = (determineErrorDisplay as unknown as vi.Mock).mock.calls;
        expect(calls[0]).toEqual([false, ids.d]);
        expect(calls[1]).toEqual([false, ids.m]);
        expect(calls[2]).toEqual([false, ids.y]);
        expect(calls[3]).toEqual([false, ids.y]);
    });
});