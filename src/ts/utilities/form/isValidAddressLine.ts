export type AddressLineCheckOptions = {
    required?: boolean;   // default true
    minLength?: number;   // default 1
    maxLength?: number;   // default 100
    trim?: boolean;       // default true
    collapseWs?: boolean; // default true, collapse runs of whitespace to a single space
};

export type AddressLineCheckResult = {
    ok: boolean;
    normalised: string;
    message?: string;
};

export function normaliseAddressLine(value: string, trim = true, collapseWs = true): string {
    let v = typeof value === 'string' ? value : '';
    if (trim) v = v.trim();
    if (collapseWs) v = v.replace(/\s+/g, ' ');
    return v;
}

/**
 * Pure address-line validator.
 * Allows Unicode letters, digits, spaces, and these symbols: , . ' ’ ‘ - / & # ( )
 * Rejects control characters (including tabs) before normalising,
 * so "Tab\tStreet" is invalid as per tests.
 */
export function isValidAddressLine(
    value: string,
    opts: AddressLineCheckOptions = {}
): AddressLineCheckResult {
    const {
        required = true,
        minLength = 1,
        maxLength = 100,
        trim = true,
        collapseWs = true
    } = opts;

    const raw = typeof value === 'string' ? value : '';

    // Reject control chars (tab, ASCII control range) before normalising
    if (/[\t\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(raw)) {
        return { ok: false, normalised: normaliseAddressLine(raw, trim, collapseWs), message: 'Remove unsupported characters.' };
    }

    const v = normaliseAddressLine(raw, trim, collapseWs);

    if (!required && v.length === 0) {
        return { ok: true, normalised: v };
    }

    if (v.length < minLength) {
        return { ok: false, normalised: v, message: `Enter at least ${minLength} characters.` };
    }

    if (v.length > maxLength) {
        return { ok: false, normalised: v, message: `Use at most ${maxLength} characters.` };
    }

    // \p{L}\p{M} letters and marks, \d digits.
    // Allowed punctuation: space , . ' ’ ‘ - / & # ( )
    const allowed = /^[\p{L}\p{M}\d ,.\-\/&#()'’‘]+$/u;

    if (!allowed.test(v)) {
        return { ok: false, normalised: v, message: 'Remove unsupported characters.' };
    }

    return { ok: true, normalised: v };
}