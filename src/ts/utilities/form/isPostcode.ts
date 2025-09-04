import { isValidPostcode } from "./isValidPostcode.js";
import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function isPostcode (formId: string, value: string): boolean {
    const formElem = document.getElementById(formId) as HTMLFormElement || false;
    const postcodeIsValid = isValidPostcode(value);

    let allValid = true;

    if (formElem && !postcodeIsValid) {
        allValid = false;
        determineErrorDisplay(allValid, formId);
    }

    return allValid;
}