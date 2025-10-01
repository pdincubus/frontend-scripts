// src/ts/utilities/form/validateAddressLine.ts
import { isValidAddressLine } from './isValidAddressLine.js';
import { determineErrorDisplay } from './determineErrorDisplay.js';

export type AddressLineOptions = {
    required?: boolean;   // default true
    maxLength?: number;   // default 100
};

export type AddressLineResult = {
    ok: boolean;
    normalised: string;
    message?: string;
};

export function normaliseAddressLine(value: string): string {
    // collapse any whitespace to single spaces and trim
    return String(value ?? '').replace(/\s+/g, ' ').trim();
}

export function validateAddressLineValue(
    value: string,
    opts: AddressLineOptions = {}
): AddressLineResult {
    const {
        required = true,
        maxLength = 100
    } = opts;

    const v = normaliseAddressLine(value);

    // empty handling
    if (!required && v.length === 0) {
        return { ok: true, normalised: v };
    }
    if (required && v.length === 0) {
        return { ok: false, normalised: v, message: 'Enter an address line.' };
    }

    // enforce maxLength before consulting legacy validator
    if (v.length > maxLength) {
        return { ok: false, normalised: v, message: `Use at most ${maxLength} characters.` };
    }

    // reject control characters (keep it simple, printable only)
    if (/[\x00-\x1F\x7F]/.test(v)) {
        return { ok: false, normalised: v, message: 'Remove control characters.' };
    }

    const ok = isValidAddressLine(v);
    return ok
        ? { ok: true, normalised: v }
        : { ok: false, normalised: v, message: 'Enter a valid address line.' };
}

export function validateAddressLine(
    formId: string,
    value: string,
    opts: AddressLineOptions = {}
): boolean {
    const res = validateAddressLineValue(value, opts);
    determineErrorDisplay(res.ok, formId);
    return res.ok;
}