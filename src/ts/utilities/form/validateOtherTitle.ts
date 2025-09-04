import { isValidName } from "./isValidName.js";
import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validateOtherTitle (otherTitleInput: HTMLInputElement, otherTitleId: string): boolean {
    let allValid = true;

    if (otherTitleInput.checkVisibility()) {
        allValid = isValidName(otherTitleInput.value);

        if (otherTitleInput.value.length === 0) {
            allValid = false;
        }
    }

    determineErrorDisplay(allValid, otherTitleId);

    return allValid;
}