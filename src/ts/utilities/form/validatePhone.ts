import { isValidPhone } from "./isValidPhone.js";
import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validatePhone (phoneInput: HTMLInputElement, phoneId: string): boolean {
    phoneInput.value = phoneInput.value.replace(/ /g, '');
    phoneInput.value = phoneInput.value.replace("+44", "0");

    const allValid = isValidPhone(phoneInput.value);

    determineErrorDisplay(allValid, phoneId);

    return allValid;
}