import { isValidAddressLine } from "./isValidAddressLine.js";
import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validateAddressLine(addressLine: HTMLInputElement, newCreditDetailsEntryClassname: string): boolean {
    let allValid = true;

    if (addressLine.value === "") {
        allValid = false;
    }else{
        allValid = isValidAddressLine(addressLine.value);
    }

    if (addressLine.parentElement?.classList.contains(newCreditDetailsEntryClassname)) {
        //determineNewCheckoutErrorDisplay(allValid,  addressLine.id);
    } else {
        determineErrorDisplay(allValid, addressLine.id);
    }

    return allValid;
}