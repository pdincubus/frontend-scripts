import { isValidPostcode } from './isValidPostcode.js';
import { determineErrorDisplay } from './determineErrorDisplay.js';

export type PostcodeCheckResult = {
    ok: boolean;
    normalised: string;
};

/** Uppercase. Trim. Ensure a single space before the inward code. */
export function normalisePostcode(value: string): string {
    if (typeof value !== 'string') return '';
    const v = value.trim().toUpperCase().replace(/\s+/g, '');
    if (v.length < 5) return v; // too short to safely split, leave as is
    return `${v.slice(0, -3)} ${v.slice(-3)}`;
}

/** Pure check that returns ok and the normalised value. */
export function isPostcodeValue(value: string): PostcodeCheckResult {
    const normalised = normalisePostcode(value);
    return { ok: isValidPostcode(normalised), normalised };
}

/** Thin wrapper. Reports via determineErrorDisplay and returns boolean. */
export function isPostcode(formId: string, value: string): boolean {
    const res = isPostcodeValue(value);
    determineErrorDisplay(res.ok, formId);
    return res.ok;
}