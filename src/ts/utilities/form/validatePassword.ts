import { PasswordStrength } from '../../global/PasswordStrength.js';
import { determineErrorDisplay } from './determineErrorDisplay.js';

export type PasswordRules = {
    required?: boolean;     // default true
    minStrength?: number;   // 1..5, default 3 (Good)
};

export type PasswordResult = {
    ok: boolean;
    strength: number;       // 1..5 from PasswordStrength.determineComplexity
    complexity: string;     // "Very Weak".."Very Strong", or "Too Short"/"Too Long"
    score: number;          // 0..100 after clamps
};

/**
 * Pure validator. No DOM. Uses PasswordStrength internally.
 */
export function validatePasswordValue(value: string, rules: PasswordRules = {}): PasswordResult {
    const { required = true, minStrength = 3 } = rules;

    const trimmed = value ?? '';

    if (!required && trimmed.length === 0) {
        return { ok: true, strength: 0, complexity: 'Very Weak', score: 0 };
    }

    const ps = new PasswordStrength();
    const res = ps.checkPassword(trimmed);

    // Base validity from your PasswordStrength outputs
    const baseOk = Boolean(res?.outputs?.isValid);

    // Extra app-level guard: enforce a minimum strength if provided
    const strength = res?.overallValues?.strength ?? 0;
    const complexity = res?.overallValues?.complexity ?? 'Very Weak';
    const score = res?.outputs?.score ?? 0;

    const ok = baseOk && strength >= minStrength;

    return { ok, strength, complexity, score };
}

/**
 * Thin wrapper, mirrors your old pattern. Pipes to determineErrorDisplay.
 */
export function validatePassword(formId: string, value: string, rules: PasswordRules = {}): boolean {
    const res = validatePasswordValue(value, rules);
    determineErrorDisplay(res.ok, formId);
    return res.ok;
}