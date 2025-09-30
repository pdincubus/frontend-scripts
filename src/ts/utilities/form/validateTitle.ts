import { determineErrorDisplay } from './determineErrorDisplay.js';

export type TitleRules = {
    required?: boolean;
    allowList?: string[];   // case-insensitive
    minLen?: number;
    maxLen?: number;
    pattern?: RegExp;
    trim?: boolean;
};

export type TitleResult = {
    ok: boolean;
    message?: string;
    normalised: string;
};

/**
 * Pure validator, no DOM, no side effects.
 */
export function validateTitleValue(value: string, rules: TitleRules = {}): TitleResult {
    const {
        required = true,
        allowList = ['Mr', 'Mrs', 'Miss', 'Ms', 'Mx', 'Dr', 'Prof', 'Sir', 'Dame', 'Lord', 'Lady'],
        minLen = 2,
        maxLen = 20,
        pattern = /^[A-Za-z. -]{2,}$/u,
        trim = true
    } = rules;

    const v = trim ? value.trim() : value;
    const normalised = v.replace(/\s+/g, ' ');

    if (required && normalised === '') {
        return { ok: false, message: 'Select a title.', normalised };
    }

    if (normalised.length > 0 && normalised.length < minLen) {
        return { ok: false, message: `Title must be at least ${minLen} characters.`, normalised };
    }

    if (normalised.length > maxLen) {
        return { ok: false, message: `Title must be at most ${maxLen} characters.`, normalised };
    }

    if (normalised && !pattern.test(normalised)) {
        return { ok: false, message: 'Title contains invalid characters.', normalised };
    }

    if (allowList.length > 0 && normalised) {
        const set = new Set(allowList.map(s => s.toLowerCase()));
        if (!set.has(normalised.toLowerCase())) {
            return { ok: false, message: 'Select a valid title.', normalised };
        }
    }

    return { ok: true, normalised };
}

/**
 * App layer wrapper. Calls the display helper and returns the boolean.
 * No DOM mutation beyond that.
 */
export function validateTitle(
    formId: string,
    value: string,
    rules: TitleRules = {}
): boolean {
    const res = validateTitleValue(value, rules);
    determineErrorDisplay(res.ok, formId);
    return res.ok;
}