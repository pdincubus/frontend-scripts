import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validateHearAboutUs (hearAboutUsInput: HTMLInputElement, hearAboutUsId: string): boolean {
    let allValid = true;

    if (hearAboutUsInput.checkVisibility()) {
        if (hearAboutUsInput.value.length === 0 || hearAboutUsInput.value.toUpperCase() === "NONE") {
            allValid = false;
        }

        determineErrorDisplay(allValid, hearAboutUsId);
    }

    return allValid;
}