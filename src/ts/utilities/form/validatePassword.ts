import { PasswordStrength } from "../../global/PasswordStrength.js";
import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validatePassword (passwordInput: HTMLInputElement, passwordId: string): boolean {
    let allValid = true;

    const passwordStrength = new PasswordStrength();
    const passwordCheck = passwordStrength.checkPassword(passwordInput.value);

    if (passwordCheck.outputs) {
        //$("#Password").parent().nextAll("label.error:first").html(passwordChecker);
        console.log('Password strength check outputs available');
        allValid = false;
    } else {
        console.log('No password strength outputs');
        //$("#Password").parent().nextAll("label.error:first").html("Please enter a valid password.");
    }

    determineErrorDisplay(allValid, passwordId);

    return allValid;
}