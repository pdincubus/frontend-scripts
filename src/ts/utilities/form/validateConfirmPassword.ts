import { determineErrorDisplay } from './determineErrorDisplay.js';

export type ConfirmPasswordOptions = {
    trim?: boolean;        // default true
    required?: boolean;    // default true, empty confirm fails
    caseSensitive?: boolean; // default true
};

export type ConfirmPasswordResult = {
    ok: boolean;
    message?: string;
};

export function validateConfirmPasswordValue(
    password: string,
    confirm: string,
    opts: ConfirmPasswordOptions = {}
): ConfirmPasswordResult {
    const {
        trim = true,
        required = true,
        caseSensitive = true
    } = opts;

    const p = trim ? (password ?? '').trim() : (password ?? '');
    const c = trim ? (confirm ?? '').trim() : (confirm ?? '');

    // if confirm is optional, treat empty confirm as OK
    if (!required && c === '') {
        return { ok: true };
    }

    if (required && c === '') {
        return { ok: false, message: 'Confirm your password.' };
    }

    if (!caseSensitive) {
        return { ok: p.toLowerCase() === c.toLowerCase() };
    }

    return { ok: p === c };
}

/**
 * Wrapper for your form layer. Calls determineErrorDisplay and returns boolean.
 */
export function validateConfirmPassword(
    formId: string,
    password: string,
    confirm: string,
    opts: ConfirmPasswordOptions = {}
): boolean {
    const res = validateConfirmPasswordValue(password, confirm, opts);
    determineErrorDisplay(res.ok, formId);
    return res.ok;
}