export function isValidAddressLine(testString: string): boolean {
    return /^[a-z0-9 &'\-\/]+$/i.test(testString);
}