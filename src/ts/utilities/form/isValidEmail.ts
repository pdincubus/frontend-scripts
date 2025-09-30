/**
 * Validate an email address.
 * - trims input
 * - case insensitive
 * - allows "+" and common local-part symbols
 * - forbids consecutive dots and leading/trailing dot in local part
 * - domain labels cannot start or end with hyphen
 * - TLD must be 2 to 24 letters
 */
export function isValidEmail(value: string): boolean {
    if (typeof value !== 'string') return false;

    const v = value.trim();
    if (v === '') return false;

    // Split once on "@"
    const parts = v.split('@');
    if (parts.length !== 2) return false;

    const [local, domain] = parts;

    // Local part: RFC 5322-ish subset
    // Allows A–Z, 0–9 and these: .!#$%&'*+/=?^_`{|}~-
    // No leading/trailing dot, no consecutive dots
    const localPattern = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
    if (!localPattern.test(local)) return false;
    if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;

    // Domain: labels 1–63, alnum inside, hyphen allowed but not at ends.
    // Final label is the TLD: 2–24 letters
    const domainLabels = domain.split('.');
    if (domainLabels.length < 2) return false;

    for (let i = 0; i < domainLabels.length; i += 1) {
        const label = domainLabels[i];
        if (label.length < 1 || label.length > 63) return false;

        if (i === domainLabels.length - 1) {
            // TLD
            if (!/^[A-Za-z]{2,24}$/.test(label)) return false;
        } else {
            if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])$/.test(label)) return false;
        }
    }

    return true;
}