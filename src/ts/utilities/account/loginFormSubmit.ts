import { isAgentNumberOrEmail } from './isAgentNumberOrEmail.js';
import { isLDAPPassword } from './isLDAPPassword.js';
import { isPostcode } from '../form/isPostcode.js';
import { sendAnalyticsPasswordDetails } from '../analytics/sendAnalyticsPasswordDetails.js';

export function loginFormSubmit(isCookieForm = false): boolean {
    const action = (document.getElementById('action') as HTMLInputElement | null)?.value ?? '';

    // Register path bypasses validation
    if (action === 'no') return true;

    const ids = isCookieForm
        ? { acc: 'cookieLoginAccountNo', pwd: 'cookieLoginLDAPPassword', pc: 'cookieLoginPostcode' }
        : { acc: 'nonCookieLoginAccountNo', pwd: 'nonCookieLoginLDAPPassword', pc: 'nonCookieLoginPostcode' };

    const accEl = document.getElementById(ids.acc) as HTMLInputElement | null;
    const pwdEl = document.getElementById(ids.pwd) as HTMLInputElement | null;
    const pcEl  = document.getElementById(ids.pc)  as HTMLInputElement | null;

    // If any field is missing, fail fast
    if (!accEl || !pwdEl || !pcEl) return false;

    const newCustomer = (document.getElementById('newCustomerRadio') as HTMLInputElement | null)?.checked ?? false;

    // Validate account first; if bad, do not waste time on the rest
    if (!isAgentNumberOrEmail(ids.acc, accEl.value, newCustomer)) return false;

    const okPwd = isLDAPPassword(ids.pwd, pwdEl.value);
    const okPc  = isPostcode(ids.pc, pcEl.value);

    if (!okPwd || !okPc) return false;

    // Analytics is optional, only if both inputs exist and the length parses
    const strengthEl = document.getElementById('passwordStrength') as HTMLInputElement | null;
    const lengthEl   = document.getElementById('passwordLength') as HTMLInputElement | null;

    if (strengthEl && lengthEl) {
        const len = parseInt(lengthEl.value, 10);

        if (Number.isFinite(len)) {
            sendAnalyticsPasswordDetails(len, strengthEl.value);
        }
    }

    return true;
}