import { isValidPostcode } from "./isValidPostcode.js";
import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validatePostcode(postcodeElem: HTMLInputElement, newCreditDetailsEntryClassname: string): boolean {
    let allValid = true;

    const postcodeValidationElem = document.getElementById('emptyPostCodeValidation') as HTMLElement || false;
    const postcodeManualValidationElem = document.getElementById('emptyManualPostCodeValidation') as HTMLElement || false;

    if (postcodeElem && postcodeElem.value.length < 1) {
        if (postcodeElem && postcodeElem.id == "postCode") {
            postcodeValidationElem.classList.add('is_hidden');
            postcodeValidationElem.setAttribute('hidden', 'hidden');
            postcodeElem.parentElement?.classList.add("has_error");
        } else {
            postcodeManualValidationElem.classList.add('is_hidden');
            postcodeManualValidationElem.setAttribute('hidden', 'hidden');
            postcodeElem.parentElement?.classList.add("has_error");
        }
    } else {
        postcodeValidationElem.classList.add('is_hidden');
        postcodeValidationElem.setAttribute('hidden', 'hidden');
        postcodeManualValidationElem.classList.add('is_hidden');
        postcodeManualValidationElem.setAttribute('hidden', 'hidden');

        allValid = isValidPostcode(postcodeElem.value);

        if (postcodeElem.parentElement?.classList.contains(newCreditDetailsEntryClassname)) {
            //determineNewCheckoutErrorDisplay(allValid, postcodeElem);
        } else {
            determineErrorDisplay(allValid, postcodeElem.value);
        }
    }

    return allValid;
}