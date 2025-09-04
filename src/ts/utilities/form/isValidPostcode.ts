export function isValidPostcode (value: string): boolean {
    return (
        /^(((([a-pr-uwyz][a-hk-y]?[0-9][0-9]?)|(([a-pr-uwyz][0-9][a-hjkstuw])|([a-pr-uwyz][a-hk-y][0-9][abehmnprv-y])))( ?){0,}[0-9][abd-hjlnp-uw-z]{2}))$/i.test(value)
    );
}