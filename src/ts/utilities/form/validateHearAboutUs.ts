import { determineErrorDisplay } from './determineErrorDisplay.js';

export type HearAboutUsRules = {
    requiredWhenVisible?: boolean; // default true
    disallowNone?: boolean;        // default true, rejects "NONE"
    trim?: boolean;                // default true
};

export type HearAboutUsResult = {
    ok: boolean;
    normalised: string;
    message?: string;
};

/**
 * Pure validator. No DOM. No side effects.
 */
export function validateHearAboutUsValue(
    value: string,
    rules: HearAboutUsRules = {}
): HearAboutUsResult {
    const {
        requiredWhenVisible = true,
        disallowNone = true,
        trim = true
    } = rules;

    const v = trim ? value.trim() : value;
    const normalised = v;

    if (requiredWhenVisible) {
        if (normalised === '') {
            return { ok: false, normalised, message: 'Select how you heard about us.' };
        }
        if (disallowNone && normalised.toUpperCase() === 'NONE') {
            return { ok: false, normalised, message: 'Select a valid option.' };
        }
    }

    return { ok: true, normalised };
}

/**
 * App wrapper. Only reports via determineErrorDisplay when the field is visible.
 * Mirrors original behaviour without calling Element.checkVisibility().
 */
export function validateHearAboutUs(
    formId: string,
    value: string,
    isVisible: boolean,
    rules: HearAboutUsRules = {}
): boolean {
    const res = validateHearAboutUsValue(value, rules);

    if (isVisible) {
        determineErrorDisplay(res.ok, formId);
    }

    return res.ok;
}