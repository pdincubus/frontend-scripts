import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function isValidDeliveryInstructions (formId: string, checkString: string): boolean {
    const checkOK = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -+,.";
    let allValid = true;

    if ((checkString.length) < 1) {
        allValid = true;
    }

    for (let i = 0; i < checkString.length; i++) {
        let ch = checkString.charAt(i);

        for (let j = 0; j < checkOK.length; j++) {
            if (ch == checkOK.charAt(j)) {
				break;
            }

            if (j == checkOK.length - 1) {
                allValid = false;

                break;
            }
        }
    }

	determineErrorDisplay(allValid, formId);

    return allValid;
}