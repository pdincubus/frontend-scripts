import { determineErrorDisplay } from "../form/determineErrorDisplay.js";

export function isLDAPPassword (formId: string, value: string): boolean {
    const checkOK = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!#$%^&()_-+={}[]\|:;'<>,.?/";
    const passwordStrengthInput = document.getElementById('passwordStrength') as HTMLInputElement || false;
    const passwordLengthInput = document.getElementById('passwordLength') as HTMLInputElement || false;

    let allValid = true;

    if (value.length < 1) {
        allValid = false;
    }

    for (let i = 0; i < value.length; i++) {
        const ch = value.charAt(i);

        for (let j = 0; j < checkOK.length; j++) {
            if (ch == checkOK.charAt(j)) {
                break;
            }

            if (j == checkOK.length) {
                allValid = false;

                break;
            }
        }
    }

    determineErrorDisplay(allValid, formId);

    if (allValid && passwordStrengthInput) {
        //const msg = objPwdVal.chkPass(value);

        passwordLengthInput.value = value.length.toString();
        passwordStrengthInput.value = 'hello';//objPwdVal.strength;
    }

    return allValid;
}