import { isAgentNumberOrEmail } from './isAgentNumberOrEmail.js';
import { isLDAPPassword } from './isLDAPPassword.js';
import { isPostcode } from '../form/isPostcode.js';
import { sendAnalyticsPasswordDetails } from '../analytics/sendAnalyticsPasswordDetails.js';

export function loginFormSubmit (isCookieForm: boolean = false): boolean {
    let errorCount = 0;
    let loginAccountNo;
    let loginLDAPPassword;
    let loginPostcode;

    const actionInputElem = document.getElementById('action') as HTMLInputElement || false;

    if (isCookieForm) {
        loginAccountNo = 'cookieLoginAccountNo';
        loginLDAPPassword = 'cookieLoginLDAPPassword';
        loginPostcode = 'cookieLoginPostcode';
    } else {
        loginAccountNo = 'nonCookieLoginAccountNo';
        loginLDAPPassword = 'nonCookieLoginLDAPPassword';
        loginPostcode = 'nonCookieLoginPostcode';
    }

    const loginAccountNoElem = document.getElementById(loginAccountNo) as HTMLInputElement || false;
    const loginLDAPPasswordElem = document.getElementById(loginLDAPPassword) as HTMLInputElement || false;
    const loginPostcodeElem = document.getElementById(loginPostcode) as HTMLInputElement || false;

    const passwordStrengthElem = document.getElementById('passwordStrength') as HTMLInputElement || false;
    const passwordLengthElem = document.getElementById('passwordLength') as HTMLInputElement || false;
    const newCustomer = document.getElementById('newCustomerRadio') as HTMLInputElement || false;

    const validAgentNumberOrEmail = isAgentNumberOrEmail(loginAccountNo, loginAccountNoElem.value, newCustomer.checked);
    const validLdapPassword = isLDAPPassword(loginLDAPPassword, loginLDAPPasswordElem.value);
    const validPostcode = isPostcode(loginPostcode, loginPostcodeElem.value);

    // Determine whether register was selected.
    if (actionInputElem.value === "no"){
        return true;
    }

    if (!validAgentNumberOrEmail) {
        errorCount += 1;
    }

    if (errorCount == 0) {
        if (!validLdapPassword) {
            errorCount += 1;
        }

        if (!validPostcode) {
            errorCount += 1;
        }

        if (passwordStrengthElem) {
            sendAnalyticsPasswordDetails(parseInt(passwordLengthElem.value, 10), passwordStrengthElem.value);
        }

       /* if (typeof triggerRecaptcha !== "undefined") {
            triggerRecaptcha();

            return false;
        } else {*/
            return true;
        //}
    } else {
        return false;
    }
}