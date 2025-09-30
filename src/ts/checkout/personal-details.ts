import { validateName } from '../utilities/form/validateName.js';
import { validateEmail } from '../utilities/form/validateEmail.js';
import { validateConfirmEmail } from '../utilities/form/validateConfirmEmail.js';
import { validateAccountNumber } from '../utilities/form/validateAccountNumber.js';
import { validatePassword } from '../utilities/form/validatePassword.js';
import { validateConfirmPassword } from '../utilities/form/validateConfirmPassword.js';
import { validateTitle } from '../utilities/form/validateTitle.js';
import { validatePhone } from '../utilities/form/validatePhone.js';
import { validateHearAboutUs } from '../utilities/form/validateHearAboutUs.js';
import { validateDate } from '../utilities/form/validateDate.js';
import { validateAddress } from '../utilities/form/validateAddress.js';

function getEl<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function runAllValidations() {
    const firstNameInput = getEl<HTMLInputElement>('FirstName');
    const lastNameInput = getEl<HTMLInputElement>('LastName');
    const titleInput = getEl<HTMLInputElement>('Title');
    const otherTitleInput = getEl<HTMLInputElement>('otherTitle');
    const daytimeTelephoneInput = getEl<HTMLInputElement>('DayTimeTelephone');
    const emailInput = getEl<HTMLInputElement>('Email');
    const confirmEmailInput = getEl<HTMLInputElement>('ConfirmEmail');
    const passwordInput = getEl<HTMLInputElement>('Password');
    const confirmPasswordInput = getEl<HTMLInputElement>('confirmPassword');
    const accountNumberInput = getEl<HTMLInputElement>('accno');
    const hearAboutUsInput = getEl<HTMLInputElement>('HearAboutUs');
    const dobDayInput = getEl<HTMLInputElement>('dob_day');
    const dobMonthInput = getEl<HTMLInputElement>('dob_month');
    const dobYearInput = getEl<HTMLInputElement>('dob_year');

    // If any critical inputs are missing, treat as invalid so we do not submit by accident.
    if (
        !firstNameInput || !lastNameInput || !titleInput || !otherTitleInput ||
        !daytimeTelephoneInput || !emailInput || !confirmEmailInput ||
        !passwordInput || !confirmPasswordInput || !accountNumberInput ||
        !hearAboutUsInput || !dobDayInput || !dobMonthInput || !dobYearInput
    ) {
        return false;
    }

    const firstNameValid = validateName(firstNameInput.value, firstNameInput.id);
    const lastNameValid = validateName(lastNameInput.value, lastNameInput.id);

    const titleValid = validateTitle(titleInput.value, titleInput.id);
    const otherTitleValid = validateTitle(otherTitleInput.value, otherTitleInput.id);

    const phoneValid = validatePhone(daytimeTelephoneInput.value, daytimeTelephoneInput.id);

    const emailValid = validateEmail(emailInput.value, emailInput.id);
    const confirmEmailValid = validateConfirmEmail(
        emailInput.value,
        confirmEmailInput.value,
        confirmEmailInput.id
    );

    // validatePassword expects the input element for strength side effects
    const passwordValid = validatePassword(passwordInput, passwordInput.id);
    const confirmPasswordValid = validateConfirmPassword(
        passwordInput.value,
        confirmPasswordInput.value,
        confirmPasswordInput.id
    );

    const dateValid = validateDate(
        dobDayInput.value,
        dobMonthInput.value,
        dobYearInput.value
    );

    const accountNumberValid = validateAccountNumber(accountNumberInput.value, accountNumberInput.id);
    const hearAboutUsValid = validateHearAboutUs(hearAboutUsInput.value, hearAboutUsInput.id);

    const addressValid = validateAddress();

    const allValid =
        firstNameValid &&
        lastNameValid &&
        titleValid &&
        otherTitleValid &&
        phoneValid &&
        emailValid &&
        confirmEmailValid &&
        passwordValid &&
        confirmPasswordValid &&
        dateValid &&
        accountNumberValid &&
        hearAboutUsValid &&
        addressValid;

    if (!allValid) scrollToTop();

    return allValid;
}

export function initPersonalDetailsPage(): void {
    const form = getEl<HTMLFormElement>('custDetails');

    // Wire blur handlers, passing values not elements for the value-based validators
    getEl<HTMLInputElement>('FirstName')?.addEventListener('blur', e => {
        const el = e.currentTarget as HTMLInputElement;
        validateName(el.value, el.id);
    });

    getEl<HTMLInputElement>('LastName')?.addEventListener('blur', e => {
        const el = e.currentTarget as HTMLInputElement;
        validateName(el.value, el.id);
    });

    getEl<HTMLInputElement>('Title')?.addEventListener('blur', e => {
        const el = e.currentTarget as HTMLInputElement;
        validateTitle(el.value, el.id);
    });

    getEl<HTMLInputElement>('otherTitle')?.addEventListener('blur', e => {
        const el = e.currentTarget as HTMLInputElement;
        validateTitle(el.value, el.id);
    });

    getEl<HTMLInputElement>('DayTimeTelephone')?.addEventListener('blur', e => {
        const el = e.currentTarget as HTMLInputElement;
        validatePhone(el.value, el.id);
    });

    getEl<HTMLInputElement>('Email')?.addEventListener('blur', e => {
        const el = e.currentTarget as HTMLInputElement;
        validateEmail(el.value, el.id);
    });

    const confirmEmail = getEl<HTMLInputElement>('ConfirmEmail');
    const email = getEl<HTMLInputElement>('Email');
    confirmEmail?.addEventListener('blur', () => {
        validateConfirmEmail(email?.value ?? '', confirmEmail.value, confirmEmail.id);
    });

    const password = getEl<HTMLInputElement>('Password');
    password?.addEventListener('blur', () => {
        validatePassword(password, password.id);
    });

    const confirmPassword = getEl<HTMLInputElement>('confirmPassword');
    confirmPassword?.addEventListener('blur', () => {
        validateConfirmPassword(password?.value ?? '', confirmPassword.value, confirmPassword.id);
    });

    getEl<HTMLInputElement>('accno')?.addEventListener('blur', e => {
        const el = e.currentTarget as HTMLInputElement;
        validateAccountNumber(el.value, el.id);
    });

    // Submit handler
    form?.addEventListener('submit', e => {
        const ok = runAllValidations();
        if (!ok) {
            e.preventDefault();
        }
    });
}

// Auto init for live page
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => initPersonalDetailsPage());
} else {
    initPersonalDetailsPage();
}