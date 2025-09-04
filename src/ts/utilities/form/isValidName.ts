export function isValidName (value: string): boolean {
    return /^[a-z]+[a-z0-9 .'-]+$/i.test(value)
}