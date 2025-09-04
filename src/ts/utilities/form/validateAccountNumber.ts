import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validateAccountNumber (accountNumberInput: HTMLInputElement, accountNumberId: string): boolean {
    let allValid = true;

    if ((accountNumberInput.checkVisibility())
        && accountNumberInput.value.length == 0
    ) {
        allValid = false;
    }

    determineErrorDisplay(allValid, accountNumberId);

    return allValid;
}