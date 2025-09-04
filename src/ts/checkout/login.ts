import { loginFormSubmit } from "../utilities/account/loginFormSubmit.js";
import { PasswordStrength } from "../global/PasswordStrength.js";

const passwordStrength = new PasswordStrength();

const nonCookieLoginFormElem = document.getElementById('nonCookieLoginForm') as HTMLFormElement || false;
const nonCookieLoginUsernameInput = document.getElementById('nonCookieLoginAccountNo') as HTMLInputElement || false;
const cookieLoginFormElem = document.getElementById('cookieLoginForm') as HTMLFormElement || false;
const actionInputElem = document.getElementById('action') as HTMLInputElement || false;
const cookieLoginPasswordInput = document.getElementById('cookieLoginLDAPPassword') as HTMLInputElement || false;
const passwordInput = document.getElementById('password') as HTMLInputElement || false;
const newCustomerInput = document.getElementById('newCustomerRadio') as HTMLInputElement || false;
const loginAccountNumberValidationElem = document.getElementById('loginAccountNumberValidation') as HTMLElement || false;
const registerLinkElem = document.getElementById('checkout-register-account-link') as HTMLElement || false;

window.addEventListener('DOMContentLoaded', () => {
    console.info('Login JS loaded');

    if (cookieLoginPasswordInput && cookieLoginPasswordInput.value.length > 0) {
        console.log('Cookie username input has value. Focusing');
        cookieLoginPasswordInput.focus();
    }

    if (nonCookieLoginUsernameInput && nonCookieLoginUsernameInput.value.length > 0) {
        console.log('Non cookie username input has value. Focusing');
        nonCookieLoginUsernameInput.focus();
    }

    if (newCustomerInput && newCustomerInput.checked) {
        console.log('New customer input exists, is checked. Hiding password input.');
        passwordInput.setAttribute('hidden', 'hidden');
    }

    if (newCustomerInput) {
        newCustomerInput.addEventListener('click', (e: MouseEvent) => {
            console.log('New customer radio button checked');
            loginAccountNumberValidationElem.setAttribute('hidden', 'hidden');
        });
    }

    if (cookieLoginFormElem) {
        cookieLoginFormElem.addEventListener('submit', (e: SubmitEvent) => {
            console.log('Cookie form submission');
            return loginFormSubmit(true);
        });
    }

    if (cookieLoginFormElem) {
        nonCookieLoginFormElem.addEventListener('submit', (e: SubmitEvent) => {
            console.log('Non cookie form submission');
            return loginFormSubmit();
        });
    }

    if (registerLinkElem) {
        registerLinkElem.addEventListener('click', (e: MouseEvent) => {
            console.log('Register link clicked');

            const formId = (cookieLoginFormElem) ? cookieLoginFormElem.getAttribute('id') : nonCookieLoginFormElem.getAttribute('id');

            if (!formId) return;

            e.preventDefault();
            actionInputElem.value = 'no';

            if (cookieLoginFormElem) {
                cookieLoginFormElem.submit();
            } else {
                nonCookieLoginFormElem.submit();
            }
        });
    }
});

/*
$("#registerSubmit").click(function()
{
    $("label.error").hide();
});

// Determine global error display
if ($.trim($("label.global").text()).length > 0)
{
    $("label.global").show();
    $("label.tip").hide();
}*/