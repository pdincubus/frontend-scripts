import { determineErrorDisplay } from './determineErrorDisplay.js';

export function validateTitle (titleInput: HTMLInputElement, titleId: string): boolean {
    let allValid = true;

    if (titleInput.value === '') {
        allValid = false;
    }

    determineErrorDisplay(allValid, titleId);

    return allValid;
}