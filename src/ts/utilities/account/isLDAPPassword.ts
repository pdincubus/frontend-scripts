import { determineErrorDisplay } from '../form/determineErrorDisplay.js';

const CHECK_OK = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!#$%^&()_-+={}[]\\|:;'<>,.?/";

export function isLDAPPassword(formId: string, value: string): boolean {
    const passwordStrengthInput = document.getElementById('passwordStrength') as HTMLInputElement | null;
    const passwordLengthInput = document.getElementById('passwordLength') as HTMLInputElement | null;
    const v = value; // keep behaviour, no trimming unless you want it

    let allValid = v.length >= 1 && [...v].every(ch => CHECK_OK.includes(ch));

    determineErrorDisplay(allValid, formId);

    if (allValid && passwordStrengthInput && passwordLengthInput) {
        passwordLengthInput.value = String(v.length);
        passwordStrengthInput.value = 'hello'; // keeping your current behaviour
    }

    return allValid;
}