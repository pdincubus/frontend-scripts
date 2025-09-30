import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../utilities/form/validateName.js', () => ({ validateName: vi.fn(() => true) }));
vi.mock('../../utilities/form/validateEmail.js', () => ({ validateEmail: vi.fn(() => true) }));
vi.mock('../../utilities/form/validateConfirmEmail.js', () => ({ validateConfirmEmail: vi.fn(() => true) }));
vi.mock('../../utilities/form/validateAccountNumber.js', () => ({ validateAccountNumber: vi.fn(() => true) }));
vi.mock('../../utilities/form/validatePassword.js', () => ({ validatePassword: vi.fn(() => true) }));
vi.mock('../../utilities/form/validateConfirmPassword.js', () => ({ validateConfirmPassword: vi.fn(() => true) }));
vi.mock('../../utilities/form/validateTitle.js', () => ({ validateTitle: vi.fn(() => true) }));
vi.mock('../../utilities/form/validatePhone.js', () => ({ validatePhone: vi.fn(() => true) }));
vi.mock('../../utilities/form/validateHearAboutUs.js', () => ({ validateHearAboutUs: vi.fn(() => true) }));
vi.mock('../../utilities/form/validateDate.js', () => ({ validateDate: vi.fn(() => true) }));
vi.mock('../../utilities/form/validateAddress.js', () => ({ validateAddress: vi.fn(() => true) }));

import { validateName } from '../../utilities/form/validateName.js';
import { validateEmail } from '../../utilities/form/validateEmail.js';
import { validateConfirmEmail } from '../../utilities/form/validateConfirmEmail.js';
import { validateAccountNumber } from '../../utilities/form/validateAccountNumber.js';
import { validatePassword } from '../../utilities/form/validatePassword.js';
import { validateConfirmPassword } from '../../utilities/form/validateConfirmPassword.js';
import { validateTitle } from '../../utilities/form/validateTitle.js';
import { validatePhone } from '../../utilities/form/validatePhone.js';
import { validateHearAboutUs } from '../../utilities/form/validateHearAboutUs.js';
import { validateDate } from '../../utilities/form/validateDate.js';
import { validateAddress } from '../../utilities/form/validateAddress.js';

import { initPersonalDetailsPage } from '../../checkout/personal-details';

function dom() {
    document.body.innerHTML = `
        <form id="custDetails"></form>
        <input id="FirstName" value="Alice" />
        <input id="LastName" value="Smith" />
        <input id="Title" value="Ms" />
        <input id="otherTitle" value="" />
        <input id="DayTimeTelephone" value="020 7946 0000" />
        <input id="Email" value="user@example.com" />
        <input id="ConfirmEmail" value="user@example.com" />
        <input id="Password" value="Password!23" />
        <input id="confirmPassword" value="Password!23" />
        <input id="accno" value="12345678" />
        <input id="HearAboutUs" value="Friend" />
        <input id="dob_day" value="31" />
        <input id="dob_month" value="01" />
        <input id="dob_year" value="1990" />
    `;
    const form = document.getElementById('custDetails') as HTMLFormElement;
    form.submit = vi.fn() as any;
    return form;
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('personal-details page', () => {
    it('runs validators on blur with correct arguments', () => {
        dom();
        initPersonalDetailsPage();

        (document.getElementById('FirstName') as HTMLInputElement)
            .dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        expect(validateName).toHaveBeenLastCalledWith('Alice', 'FirstName');

        (document.getElementById('DayTimeTelephone') as HTMLInputElement)
            .dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        expect(validatePhone).toHaveBeenLastCalledWith('020 7946 0000', 'DayTimeTelephone');

        (document.getElementById('ConfirmEmail') as HTMLInputElement)
            .dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        expect(validateConfirmEmail).toHaveBeenLastCalledWith(
            'user@example.com',
            'user@example.com',
            'ConfirmEmail'
        );

        (document.getElementById('Password') as HTMLInputElement)
            .dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        expect(validatePassword).toHaveBeenCalled();
    });

    it('prevents submit when any validator fails', () => {
        const form = dom();
        initPersonalDetailsPage();

        (validateName as any).mockReturnValueOnce(false); // fail first field

        const prevented = !form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        expect(prevented).toBe(true);
    });

    it('allows submit when all validators pass', () => {
        const form = dom();
        initPersonalDetailsPage();

        const prevented = !form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        expect(prevented).toBe(false);
    });
});