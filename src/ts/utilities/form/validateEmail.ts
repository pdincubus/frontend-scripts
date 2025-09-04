import { isValidEmail } from "./isValidEmail.js";
import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validateEmail (emailInput: HTMLInputElement, emailId: string): boolean {
    const allValid = isValidEmail(emailInput.value);

    determineErrorDisplay(allValid, emailId);

    return allValid;
}