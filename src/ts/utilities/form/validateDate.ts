import { determineErrorDisplay } from './determineErrorDisplay.js';

export type DateRules = {
    required?: boolean;   // all parts required, default true
    minAge?: number;      // default 18
    maxAge?: number;      // optional upper bound, e.g. 120
    now?: Date;           // injectable "today" for tests, default new Date()
};

export type DateResult = {
    ok: boolean;
    dayOk: boolean;
    monthOk: boolean;
    yearOk: boolean;
    reason?: string; // for debugging/messages if you care later
    date?: Date;     // parsed DOB if valid
};

/**
 * Calculate full years between two dates (DOB to reference date).
 */
function yearsBetween(dob: Date, ref: Date): number {
    let years = ref.getFullYear() - dob.getFullYear();
    const m = ref.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && ref.getDate() < dob.getDate())) years -= 1;
    return years;
}

/**
 * Pure validator for a day/month/year trio.
 * No DOM. Returns per-part flags and overall ok.
 */
export function validateDateValue(
    dayRaw: string,
    monthRaw: string,
    yearRaw: string,
    rules: DateRules = {}
): DateResult {
    const {
        required = true,
        minAge = 18,
        maxAge,
        now = new Date()
    } = rules;

    const dayStr = (dayRaw ?? '').trim();
    const monthStr = (monthRaw ?? '').trim();
    const yearStr = (yearRaw ?? '').trim();

    let dayOk = true;
    let monthOk = true;
    let yearOk = true;

    // Required checks
    if (required) {
        if (dayStr === '') dayOk = false;
        if (monthStr === '') monthOk = false;
        if (yearStr === '') yearOk = false;
    }

    // Short-circuit if any empty failures
    if (!dayOk || !monthOk || !yearOk) {
        return { ok: false, dayOk, monthOk, yearOk, reason: 'missing' };
    }

    // Parse ints, guard NaN
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (!Number.isFinite(day) || day < 1 || day > 31) dayOk = false;
    if (!Number.isFinite(month) || month < 1 || month > 12) monthOk = false;
    if (!Number.isFinite(year) || year < 1000 || year > 9999) yearOk = false;

    if (!dayOk || !monthOk || !yearOk) {
        return { ok: false, dayOk, monthOk, yearOk, reason: 'range' };
    }

    // Calendar validity using Date rollback check
    const then = new Date(year, month - 1, day);
    if (
        then.getFullYear() !== year ||
        then.getMonth() + 1 !== month ||
        then.getDate() !== day
    ) {
        dayOk = monthOk = yearOk = false;
        return { ok: false, dayOk, monthOk, yearOk, reason: 'invalid-date' };
    }

    // Age rules
    const age = yearsBetween(then, now);

    if (minAge !== undefined && age < minAge) {
        dayOk = monthOk = yearOk = false;
        return { ok: false, dayOk, monthOk, yearOk, reason: 'underage', date: then };
    }

    if (maxAge !== undefined && age > maxAge) {
        dayOk = monthOk = yearOk = false;
        return { ok: false, dayOk, monthOk, yearOk, reason: 'overage', date: then };
    }

    return { ok: true, dayOk: true, monthOk: true, yearOk: true, date: then };
}

/**
 * Thin wrapper that mirrors your old behaviour:
 * - calls determineErrorDisplay for each input id
 * - also calls it for the overall result using the year id (like your original)
 * - returns the overall boolean
 */
export function validateDate(
    dobDayId: string,
    dobMonthId: string,
    dobYearId: string,
    dobDayValue: string,
    dobMonthValue: string,
    dobYearValue: string,
    rules: DateRules = {}
): boolean {
    const res = validateDateValue(dobDayValue, dobMonthValue, dobYearValue, rules);

    determineErrorDisplay(res.dayOk, dobDayId);
    determineErrorDisplay(res.monthOk, dobMonthId);
    determineErrorDisplay(res.yearOk, dobYearId);
    // overall, using the year id as in the legacy function
    determineErrorDisplay(res.ok, dobYearId);

    return res.ok;
}