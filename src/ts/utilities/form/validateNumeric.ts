/**
 * Validate that a string represents a whole number.
 *
 * Accepts optional leading/trailing whitespace. By default only allows
 * non-negative integers (0, 1, 2…).
 */
export function validateNumeric(value: string): boolean {
    if (typeof value !== 'string') return false;

    // ^\s*     optional leading whitespace
    // \d+      one or more digits
    // \s*$     optional trailing whitespace
    const pattern = /^\s*\d+\s*$/;

    return pattern.test(value);
}