import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validateConfirmPassword (passwordInput: HTMLInputElement, confirmPasswordInput: HTMLInputElement, confirmPasswordId: string): boolean {
    let allValid = true;

    if (confirmPasswordInput.value !== passwordInput.value) {
        allValid = false;
    }

    determineErrorDisplay(allValid, confirmPasswordId);

    return allValid;
}