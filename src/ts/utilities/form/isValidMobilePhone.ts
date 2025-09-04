export function isValidMobilePhone (value: string): boolean {
    return /^0(((70|71|72|73|74|75|77|78|79)\d{2})|(7624))(\s?\d{3}\s?\d{3})$/i.test(value)
}