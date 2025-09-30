import { determineErrorDisplay } from './determineErrorDisplay.js';
import {
    isValidAddressLine,
    normaliseAddressLine,
    type AddressLineCheckOptions,
    type AddressLineCheckResult
} from './isValidAddressLine.js';

export { normaliseAddressLine } from './isValidAddressLine.js';

/** Pure value validator kept for tests. */
export function validateAddressLineValue(
    value: string,
    opts: AddressLineCheckOptions = {}
): AddressLineCheckResult {
    const { required = true } = opts;

    // normalise first, then decide emptiness
    const v = normaliseAddressLine(value, true, true);

    // empty handling must not hit the delegate
    if (v.length === 0) {
        return required
            ? { ok: false, normalised: v, message: 'Enter at least 1 characters.' }
            : { ok: true, normalised: v };
    }

    // delegate may be mocked to return boolean or object
    const res = (isValidAddressLine as any)(v);

    if (typeof res === 'boolean') {
        return { ok: res, normalised: v };
    }
    if (res && typeof res === 'object' && 'ok' in res) {
        return res as AddressLineCheckResult;
    }

    // defensive fallback in case a mock returns undefined
    return { ok: Boolean(res), normalised: v };
}

/** Boolean wrapper that reports via determineErrorDisplay. */
export function validateAddressLine(
    formId: string,
    value: string,
    opts: AddressLineCheckOptions = {}
): boolean {
    const res = validateAddressLineValue(value, opts);
    determineErrorDisplay(res.ok, formId);
    return res.ok;
}

/** Optional: wrapper that returns the normalised value too. */
export function validateAddressLineReturnNormalised(
    formId: string,
    value: string,
    opts: AddressLineCheckOptions = {}
): AddressLineCheckResult {
    const res = validateAddressLineValue(value, opts);
    determineErrorDisplay(res.ok, formId);
    return res;
}