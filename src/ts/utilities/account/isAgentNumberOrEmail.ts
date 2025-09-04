import { determineErrorDisplay } from "../form/determineErrorDisplay.js";

export function isAgentNumberOrEmail (formId: string, value: string, isNewCustomer: boolean = false): boolean {
    // Ignore validation if the customer is new.
    if (isNewCustomer) {
        return true;
    }

    const allValid = (
        /^[A-Za-z](\d{7}|\d{9})$/.test(value)
        || /^[A-Za-z]{2}\d{6}$/.test(value)
        || /^\d{2}[A-Za-z]\d{5}$/.test(value)
        || /^[0-9]{4,8}$/.test(value)
        || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(value)
    );

    determineErrorDisplay(allValid, formId);

    return allValid;
}