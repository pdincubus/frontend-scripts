export function isValidPhone (value: string): boolean {
    return /^0((20|23|24|28|29)(\s?\d{4}\s?\d{4})|(((70|71|72|73|74|75|77|78|79)\d{2})|(7624))(\s?\d{3}\s?\d{3})|(11\d|1\d1)(\s?\d{3}\s?\d{4})|(1\d{3})(\s?\d{3}\s?\d{2,3}))$/.test(value)
}