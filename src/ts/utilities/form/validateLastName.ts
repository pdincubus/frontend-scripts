import { isValidName } from "./isValidName.js";
import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validateLastName(lastNameInput: HTMLInputElement, lastNameId: string): boolean {
    const sanitizeQuotes = lastNameInput.value.replace(/’/g, '\'').replace(/‘/g, '\'');

    if (sanitizeQuotes !== lastNameInput.value){
        lastNameInput.value = sanitizeQuotes;
    };

    const allValid = isValidName(lastNameInput.value);

    determineErrorDisplay(allValid, lastNameId);

    return allValid;
}