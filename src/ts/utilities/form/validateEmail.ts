import { isValidEmail } from './isValidEmail.js';
import { determineErrorDisplay } from './determineErrorDisplay.js';

export type EmailOptions = {
    trim?: boolean;       // default true
    toLowerCase?: boolean; // default true
};

export type EmailResult = {
    ok: boolean;
    normalised: string;
    message?: string;
};

/**
 * Pure validator. No DOM.
 */
export function validateEmailValue(value: string, opts: EmailOptions = {}): EmailResult {
    const { trim = true, toLowerCase = true } = opts;

    let v = typeof value === 'string' ? value : '';
    if (trim) v = v.trim();
    if (toLowerCase) v = v.toLowerCase();

    const ok = isValidEmail(v);

    return ok
        ? { ok: true, normalised: v }
        : { ok: false, normalised: v, message: 'Enter a valid email address.' };
}

/**
 * Thin wrapper. Calls determineErrorDisplay and returns boolean.
 */
export function validateEmail(formId: string, value: string, opts: EmailOptions = {}): boolean {
    const res = validateEmailValue(value, opts);
    determineErrorDisplay(res.ok, formId);
    return res.ok;
}