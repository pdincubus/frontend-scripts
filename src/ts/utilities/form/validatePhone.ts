import { isValidPhone } from './isValidPhone.js';
import { determineErrorDisplay } from './determineErrorDisplay.js';

export type PhoneOptions = {
    normalise?: boolean; // default true
};

export type PhoneResult = {
    ok: boolean;
    normalised: string;
};

/**
 * Strip spaces and normalise leading +44 → 0.
 */
export function normalisePhone(value: string): string {
    let v = value.replace(/\s+/g, '');
    if (v.startsWith('+44')) {
        v = '0' + v.slice(3);
    }
    return v;
}

/**
 * Pure validator. No DOM.
 */
export function validatePhoneValue(value: string, opts: PhoneOptions = {}): PhoneResult {
    const { normalise = true } = opts;
    const cleaned = normalise ? normalisePhone(value) : value;
    const ok = isValidPhone(cleaned);
    return { ok, normalised: cleaned };
}

/**
 * Wrapper. Calls display helper and returns boolean.
 */
export function validatePhone(formId: string, value: string, opts: PhoneOptions = {}): boolean {
    const res = validatePhoneValue(value, opts);
    determineErrorDisplay(res.ok, formId);
    return res.ok;
}