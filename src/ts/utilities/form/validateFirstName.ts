import { isValidName } from "./isValidName.js";
import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validateFirstName (firstNameInput: HTMLInputElement, firstNameId: string): boolean {
    const allValid = isValidName(firstNameInput.value);

    determineErrorDisplay(allValid, firstNameId);

    return allValid;
}