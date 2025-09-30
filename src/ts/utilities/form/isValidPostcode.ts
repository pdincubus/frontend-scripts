/**
 * Validates a UK postcode.
 * Supports standard formats and the special "GIR 0AA".
 * Case-insensitive. Allows an optional single space before the inward part.
 */
export function isValidPostcode(value: string): boolean {
    if (typeof value !== 'string') return false;

    const v = value.trim().toUpperCase();

    // Based on official format rules:
    // Outward: A9, A9A, A99, AA9, AA9A, AA99
    // Inward: 9AA
    // Special: GIR 0AA
    const pattern =
        /^((GIR\s?0AA)|((([A-PR-UWYZ][0-9][0-9]?)|([A-PR-UWYZ][A-HK-Y][0-9][0-9]?)|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?[0-9][ABD-HJLNP-UW-Z]{2}))$/i;

    return pattern.test(v);
}