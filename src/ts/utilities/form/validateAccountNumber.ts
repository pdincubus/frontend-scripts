import { determineErrorDisplay } from './determineErrorDisplay.js';

export type AccountNumberOptions = {
    required?: boolean; // default true
    minLength?: number; // default 1
    maxLength?: number; // optional upper bound
    pattern?: RegExp;   // optional regex, e.g. /^\d+$/
};

export function validateAccountNumberValue(
    value: string,
    opts: AccountNumberOptions = {}
): { ok: boolean; message?: string } {
    const {
        required = true,
        minLength = 1,
        maxLength,
        pattern
    } = opts;

    const trimmed = value.trim();

    if (required && trimmed.length < minLength) {
        return { ok: false, message: 'Account number is required.' };
    }

    if (maxLength && trimmed.length > maxLength) {
        return { ok: false, message: `Account number must be ≤ ${maxLength} chars.` };
    }

    if (pattern && !pattern.test(trimmed)) {
        return { ok: false, message: 'Account number format is invalid.' };
    }

    return { ok: true };
}

/** DOM-aware wrapper. Pipes result into determineErrorDisplay */
export function validateAccountNumber(
    accountNumberId: string,
    accountNumberInput: HTMLInputElement,
    opts: AccountNumberOptions = {}
): boolean {
    const res = validateAccountNumberValue(accountNumberInput.value, opts);
    determineErrorDisplay(res.ok, accountNumberId);
    return res.ok;
}