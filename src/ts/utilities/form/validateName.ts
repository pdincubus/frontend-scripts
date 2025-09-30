import { isValidName } from './isValidName.js';
import { determineErrorDisplay } from './determineErrorDisplay.js';

export function validateName(value: string, fieldId: string): boolean {
    const sanitised = value.replace(/[’‘]/g, "'").trim();
    const ok = isValidName(sanitised);

    determineErrorDisplay(ok, fieldId);

    return ok;
}