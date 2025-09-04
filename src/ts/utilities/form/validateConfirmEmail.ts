import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validateConfirmEmail (emailInput: HTMLInputElement, confirmEmailInput: HTMLInputElement, confirmEmailId: string): boolean {
    let allValid = true;

    if (
        confirmEmailInput.value !== emailInput.value
        && confirmEmailInput.value.length !== 0
    ) {
        allValid = false;
    }

    if (
        confirmEmailInput.value.length === 0
        && emailInput.value.length !== 0
    ) {
        allValid = false;
    }

    determineErrorDisplay(allValid, confirmEmailId);

    return allValid;
}