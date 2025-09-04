import { validateFirstName } from '../utilities/form/validateFirstName.js';
import { validateLastName } from '../utilities/form/validateLastName.js';
import { validateEmail } from '../utilities/form/validateEmail.js';
import { validateConfirmEmail } from '../utilities/form/validateConfirmEmail.js';
import { validateAccountNumber } from '../utilities/form/validateAccountNumber.js';
import { validatePassword } from '../utilities/form/validatePassword.js';
import { validateConfirmPassword } from '../utilities/form/validateConfirmPassword.js';
import { validateTitle } from '../utilities/form/validateTitle.js';
import { validateOtherTitle } from '../utilities/form/validateOtherTitle.js';
import { validatePhone } from '../utilities/form/validatePhone.js';
import { validateHearAboutUs } from '../utilities/form/validateHearAboutUs.js';
import { validateDate } from '../utilities/form/validateDate.js';
import { validateAddress } from '../utilities/form/validateAddress.js';

function formSubmit(
    firstNameValid: boolean,
    lastNameValid: boolean,
    titleValid: boolean,
    otherTitleValid: boolean,
    phoneValid: boolean,
    emailValid: boolean,
    confirmEmailValid: boolean,
    passwordValid: boolean,
    confirmPasswordValid: boolean,
    dateValid: boolean,
    accountNumberValid: boolean,
    hearAboutUsValid: boolean,
    addressValid: boolean
): boolean {
	let allValid = true;

    if (
        !firstNameValid
        || !lastNameValid
        || !titleValid
        || !otherTitleValid
        || !phoneValid
        || !emailValid
        || !confirmEmailValid
        || !passwordValid
        || !confirmPasswordValid
        || !dateValid
        || !accountNumberValid
        || !hearAboutUsValid
        || !addressValid
    ) {
        allValid = false;

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

	return allValid;
}

window.addEventListener('DOMContentLoaded', () => {
    console.info('Personal details JS loaded');

    const custDetailsForm = document.getElementById('custDetails') as HTMLFormElement || false;
    const firstNameInput = document.getElementById('FirstName') as HTMLInputElement || false;
    const lastNameInput = document.getElementById('LastName') as HTMLInputElement || false;
    const titleInput = document.getElementById('Title') as HTMLInputElement || false;
    const otherTitleInput = document.getElementById('otherTitle') as HTMLInputElement || false;
    const daytimeTelephoneInput = document.getElementById('DayTimeTelephone') as HTMLInputElement || false;
    const emailInput = document.getElementById('Email') as HTMLInputElement || false;
    const confirmEmailInput = document.getElementById('ConfirmEmail') as HTMLInputElement || false;
    const passwordInput = document.getElementById('Password') as HTMLInputElement || false;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement || false;
    const accountNumberInput = document.getElementById('accno') as HTMLInputElement || false;
    const hearAboutUsInput = document.getElementById('HearAboutUs') as HTMLInputElement || false;
    const dobDayInput = document.getElementById('dob_day') as HTMLInputElement || false;
    const dobMonthInput = document.getElementById('dob_month') as HTMLInputElement || false;
    const dobYearInput = document.getElementById('dob_year') as HTMLInputElement || false;

    let firstNameValid = validateFirstName(firstNameInput, firstNameInput.id)
    let lastNameValid = validateLastName(lastNameInput, lastNameInput.id);
    let titleValid = validateTitle(titleInput, titleInput.id);
    let otherTitleValid = validateOtherTitle(otherTitleInput, otherTitleInput.id);
    let phoneValid = validatePhone(daytimeTelephoneInput, daytimeTelephoneInput.id);
    let emailValid = validateEmail(emailInput, emailInput.id);
    let confirmEmailValid = validateConfirmEmail(emailInput, confirmEmailInput, confirmEmailInput.id);
    let passwordValid = validatePassword(passwordInput, passwordInput.id);
    let confirmPasswordValid = validateConfirmPassword(passwordInput, confirmPasswordInput, confirmPasswordInput.id);
    let dateValid = validateDate(dobDayInput, dobMonthInput, dobYearInput);
    let accountNumberValid = validateAccountNumber(accountNumberInput, accountNumberInput.id);
    let hearAboutUsValid = validateHearAboutUs(hearAboutUsInput, hearAboutUsInput.id);
    let addressValid = validateAddress();

    custDetailsForm.addEventListener('submit', (e: SubmitEvent) => {
        e.preventDefault();

        return formSubmit(
            firstNameValid,
            lastNameValid,
            titleValid,
            otherTitleValid,
            phoneValid,
            emailValid,
            confirmEmailValid,
            passwordValid,
            confirmPasswordValid,
            dateValid,
            accountNumberValid,
            hearAboutUsValid,
            addressValid
        );
    });

    firstNameInput.addEventListener('blur', (e: FocusEvent) => {
        validateFirstName(firstNameInput, firstNameInput.id);
    });

    lastNameInput.addEventListener('blur', (e: FocusEvent) => {
        validateLastName(lastNameInput, lastNameInput.id);
    });

    titleInput.addEventListener('blur', (e: FocusEvent) => {
        validateTitle(titleInput, titleInput.id);
    });

    otherTitleInput.addEventListener('blur', (e: FocusEvent) => {
        validateOtherTitle(otherTitleInput, otherTitleInput.id);
    });

    daytimeTelephoneInput.addEventListener('blur', (e: FocusEvent) => {
        validatePhone(daytimeTelephoneInput, daytimeTelephoneInput.id);
    });

    emailInput.addEventListener('blur', (e: FocusEvent) => {
        validateEmail(emailInput, emailInput.id);
    });

    confirmEmailInput.addEventListener('blur', (e: FocusEvent) => {
        validateConfirmEmail(emailInput, confirmEmailInput, confirmEmailInput.id);
    });

    passwordInput.addEventListener('blur', (e: FocusEvent) => {
        validatePassword(passwordInput, passwordInput.id);
    });

    confirmPasswordInput.addEventListener('blur', (e: FocusEvent) => {
        validateConfirmPassword(passwordInput, confirmPasswordInput, confirmPasswordInput.id);
    });

    accountNumberInput.addEventListener('blur', (e: FocusEvent) => {
        validateAccountNumber(accountNumberInput, accountNumberInput.id);
    });
});