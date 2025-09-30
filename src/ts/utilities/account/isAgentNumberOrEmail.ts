import { determineErrorDisplay } from '../form/determineErrorDisplay.js';
import { PATTERN_AGENT, PATTERN_EMAIL } from './patterns';

export type ErrorDisplay = (ok: boolean, formId: string) => void;

export function isAgentNumberOrEmailP(
    value: string,
    isNewCustomer = false
): boolean {
    if (isNewCustomer) return true;

    const v = value.trim();

    return PATTERN_AGENT.some(rx => rx.test(v)) || PATTERN_EMAIL.test(v);
}

export function isAgentNumberOrEmail(
    formId: string,
    value: string,
    isNewCustomer = false,
    display: ErrorDisplay = determineErrorDisplay
): boolean {
    const ok = isAgentNumberOrEmailP(value, isNewCustomer);

    if (!isNewCustomer) display(ok, formId);

    return ok;
}