import { determineErrorDisplay } from './determineErrorDisplay.js';

export type ConfirmEmailOptions = {
    trim?: boolean;                 // trim both values, default true
    caseSensitive?: boolean;        // compare case-sensitively, default false for emails
    requiredIfEmailPresent?: boolean; // confirm required if email is non-empty, default true
};

export type ConfirmEmailResult = {
    ok: boolean;
    message?: string;
};

/**
 * Pure validator. No DOM.
 * By default:
 * - trims values
 * - compares case-insensitively
 * - requires confirm if email is non-empty
 * - if both empty, returns ok=true and lets the main email validator enforce requiredness
 */
export function validateConfirmEmailValue(
    email: string,
    confirm: string,
    opts: ConfirmEmailOptions = {}
): ConfirmEmailResult {
    const {
        trim = true,
        caseSensitive = false,
        requiredIfEmailPresent = true
    } = opts;

    let e = email ?? '';
    let c = confirm ?? '';

    if (trim) {
        e = e.trim();
        c = c.trim();
    }

    // both empty, let the main email field enforce requiredness
    if (e === '' && c === '') {
        return { ok: true };
    }

    // if confirm is optional, treat empty confirm as OK
    if (!requiredIfEmailPresent && e !== '' && c === '') {
        return { ok: true };
    }

    // default behaviour, require confirm if email present
    if (requiredIfEmailPresent && e !== '' && c === '') {
        return { ok: false, message: 'Confirm your email address.' };
    }

    if (!caseSensitive) {
        return { ok: e.toLowerCase() === c.toLowerCase() };
    }

    return { ok: e === c };
}

/**
 * Wrapper for forms. Calls determineErrorDisplay and returns the boolean.
 */
export function validateConfirmEmail(
    formId: string,
    email: string,
    confirm: string,
    opts: ConfirmEmailOptions = {}
): boolean {
    const res = validateConfirmEmailValue(email, confirm, opts);
    determineErrorDisplay(res.ok, formId);
    return res.ok;
}