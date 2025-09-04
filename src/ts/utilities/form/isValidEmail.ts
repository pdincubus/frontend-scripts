export function isValidEmail (value: string): boolean {
    return /^[\w-]+(\.[_\w-]+)*@([\w-]+\.)+[\w-]{2,6}$/i.test(value)
}