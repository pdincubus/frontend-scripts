import { isValidPostcode } from './isValidPostcode.js';
import { determineErrorDisplay } from './determineErrorDisplay.js';

export type PostcodeOptions = {
    required?: boolean;   // empty invalid by default
    normalise?: boolean;  // uppercase and add single space before last 3 chars
};

export type PostcodeResult = {
    ok: boolean;
    normalised: string;
    message?: string;
};

/**
 * Normalise a UK postcode to "OUTWARD INWARD".
 * If value is shorter than 4 after stripping spaces, returns uppercased value unchanged.
 */
export function normaliseUkPostcode(value: string): string {
    const raw = value.toUpperCase().replace(/\s+/g, '');
    if (raw.length < 4) return raw;
    return `${raw.slice(0, raw.length - 3)} ${raw.slice(-3)}`;
}

/**
 * Pure validator, no DOM.
 */
export function validatePostcodeValue(value: string, opts: PostcodeOptions = {}): PostcodeResult {
    const { required = true, normalise = true } = opts;

    const trimmed = value.trim();
    const normalised = normalise ? normaliseUkPostcode(trimmed) : trimmed;

    if (required && normalised === '') {
        return { ok: false, normalised, message: 'Enter a postcode.' };
    }

    if (normalised === '') {
        // not required and empty
        return { ok: true, normalised };
    }

    const ok = isValidPostcode(normalised);
    return ok
        ? { ok: true, normalised }
        : { ok: false, normalised, message: 'Enter a valid UK postcode.' };
}

/**
 * App wrapper. Calls the display helper and returns the boolean.
 */
export function validatePostcode(formId: string, value: string, opts: PostcodeOptions = {}): boolean {
    const res = validatePostcodeValue(value, opts);
    determineErrorDisplay(res.ok, formId);
    return res.ok;
}