export function validateNumeric(testString: string): boolean {
    const regexp = new RegExp(/^\s*\d+\s*$/);

    return (regexp.test(testString));
}