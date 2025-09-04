import { validateAddressLine } from "./validateAddressLine.js";
import { validatePostcode } from "./validatePostcode.js";

export function validateAddress(): boolean {
    let allValid = true;

    const newCreditDetailsEntryClassname = 'newCreditDetailsInputFieldsEntry';

    const manualAddressContainerElem = document.getElementById('addressInputAllSection') as HTMLElement || false;
    const addressLine1 = document.getElementById('#address_1') as HTMLInputElement || false;
    const addressLine2 = document.getElementById('#address_2') as HTMLInputElement || false;
    const addressLine3 = document.getElementById('#address_3') as HTMLInputElement || false;
    const addressLine4 = document.getElementById('#address_4') as HTMLInputElement || false;
    const addressCity = document.getElementById('#city') as HTMLInputElement || false;
    const addressCounty = document.getElementById('#county') as HTMLInputElement || false;
    const addressPostcode = document.getElementById('#postCode') as HTMLInputElement || false;

    if (manualAddressContainerElem.checkVisibility()) {
        if (
            !validateAddressLine(addressLine1, newCreditDetailsEntryClassname)
            || !validateAddressLine(addressLine2, newCreditDetailsEntryClassname)
            || !validateAddressLine(addressLine3, newCreditDetailsEntryClassname)
            || !validateAddressLine(addressLine4, newCreditDetailsEntryClassname)
            || !validateAddressLine(addressCity, newCreditDetailsEntryClassname)
            || !validateAddressLine(addressCounty, newCreditDetailsEntryClassname)
            || !validatePostcode(addressPostcode, newCreditDetailsEntryClassname)
        ) {
            allValid = false;
        }
    }

    return allValid;
}