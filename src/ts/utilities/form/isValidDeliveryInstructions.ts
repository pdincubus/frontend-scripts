import { determineErrorDisplay } from './determineErrorDisplay.js';

export type DeliveryInstructionsOptions = {
    required?: boolean;     // default false
    minLength?: number;     // default 0
    maxLength?: number;     // default 500
    trim?: boolean;         // default true
};

export type DeliveryInstructionsResult = {
    ok: boolean;
    normalised: string;
    message?: string;
};

/**
 * Pure validator for delivery instructions (textarea).
 * Allows letters, digits, spaces, common punctuation, and new lines.
 * Blocks angle brackets to avoid pasted HTML and blocks control chars.
 */
export function validateDeliveryInstructionsValue(
    value: string,
    opts: DeliveryInstructionsOptions = {}
): DeliveryInstructionsResult {
    const {
        required = false,
        minLength = 0,
        maxLength = 500,
        trim = true
    } = opts;

    let v = typeof value === 'string' ? value : '';
    if (trim) v = v.trim();

    if (!required && v.length === 0) {
        return { ok: true, normalised: v };
    }

    if (required && v.length === 0) {
        return { ok: false, normalised: v, message: 'Enter delivery instructions.' };
    }

    if (v.length < minLength) {
        return { ok: false, normalised: v, message: `Enter at least ${minLength} characters.` };
    }

    if (v.length > maxLength) {
        return { ok: false, normalised: v, message: `Use at most ${maxLength} characters.` };
    }

    // Allowed chars: letters (incl. accents), marks, digits, space, newline,
    // . , ' " + - : ; ( ) ! ? # & / @
    // No angle brackets, no tabs or other control chars.
    const allowed = /^[\p{L}\p{M}\d .,'"+\-:;()!?#&/@\n\r]+$/u;
    if (!allowed.test(v)) {
        return { ok: false, normalised: v, message: 'Remove unsupported characters.' };
    }

    // Explicitly reject < or > to avoid pasted HTML
    if (/[<>]/.test(v)) {
        return { ok: false, normalised: v, message: 'HTML-like characters are not allowed.' };
    }

    // Reject tabs and other control chars apart from CR/LF
    if (/[\t\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(v)) {
        return { ok: false, normalised: v, message: 'Remove control characters.' };
    }

    return { ok: true, normalised: v };
}

/**
 * Thin wrapper for forms. Reports via determineErrorDisplay and returns boolean.
 */
export function validateDeliveryInstructions(
    formId: string,
    value: string,
    opts: DeliveryInstructionsOptions = {}
): boolean {
    const res = validateDeliveryInstructionsValue(value, opts);
    determineErrorDisplay(res.ok, formId);
    return res.ok;
}