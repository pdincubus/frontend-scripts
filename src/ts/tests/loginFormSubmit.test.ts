import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock deps exactly how the SUT imports them
vi.mock('../utilities/account/isAgentNumberOrEmail.js', () => ({
    isAgentNumberOrEmail: vi.fn()
}));

vi.mock('../utilities/account/isLDAPPassword.js', () => ({
    isLDAPPassword: vi.fn()
}));

vi.mock('../utilities/form/isPostcode.js', () => ({
    isPostcode: vi.fn()
}));

vi.mock('../utilities/analytics/sendAnalyticsPasswordDetails.js', () => ({
    sendAnalyticsPasswordDetails: vi.fn()
}));

import { isAgentNumberOrEmail } from '../utilities/account/isAgentNumberOrEmail.js';
import { isLDAPPassword } from '../utilities/account/isLDAPPassword.js';
import { isPostcode } from '../utilities/form/isPostcode.js';
import { sendAnalyticsPasswordDetails } from '../utilities/analytics/sendAnalyticsPasswordDetails.js';

import { loginFormSubmit } from '../utilities/account/loginFormSubmit';

function input(id: string, value = ''): HTMLInputElement {
    const el = document.createElement('input');
    el.id = id;
    el.value = value;
    document.body.append(el);
    return el;
}

function mountDom(opts?: {
    cookie?: boolean;
    account?: string;
    password?: string;
    postcode?: string;
    action?: string;
    newCustomer?: boolean;
    strengthEl?: boolean;
    lengthVal?: string;
    strengthVal?: string;
}) {
    const {
        cookie = false,
        account = 'user@example.com',
        password = 'Good123!',
        postcode = 'SW1A 1AA',
        action = 'yes',
        newCustomer = false,
        strengthEl = true,
        lengthVal = '8',
        strengthVal = 'Strong'
    } = opts || {};

    document.body.innerHTML = '';

    input('action', action);

    const ids = cookie
        ? { acc: 'cookieLoginAccountNo', pwd: 'cookieLoginLDAPPassword', pc: 'cookieLoginPostcode' }
        : { acc: 'nonCookieLoginAccountNo', pwd: 'nonCookieLoginLDAPPassword', pc: 'nonCookieLoginPostcode' };

    input(ids.acc, account);
    input(ids.pwd, password);
    input(ids.pc, postcode);

    const nc = input('newCustomerRadio');
    nc.checked = newCustomer;

    if (strengthEl) {
        input('passwordStrength', strengthVal);
        input('passwordLength', lengthVal);
    }
}

beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('loginFormSubmit', () => {
    it('returns true immediately when action is "no" and does not call validators', () => {
        mountDom({ action: 'no' });

        expect(loginFormSubmit(false)).toBe(true);

        expect(isAgentNumberOrEmail).not.toHaveBeenCalled();
        expect(isLDAPPassword).not.toHaveBeenCalled();
        expect(isPostcode).not.toHaveBeenCalled();
        expect(sendAnalyticsPasswordDetails).not.toHaveBeenCalled();
    });

    it('returns false when agent number or email is invalid', () => {
        mountDom();
        (isAgentNumberOrEmail as vi.Mock).mockReturnValue(false);
        (isLDAPPassword as vi.Mock).mockReturnValue(true);
        (isPostcode as vi.Mock).mockReturnValue(true);

        expect(loginFormSubmit(false)).toBe(false);
        expect(sendAnalyticsPasswordDetails).not.toHaveBeenCalled();
    });

    it('returns false when password invalid despite valid agent', () => {
        mountDom();
        (isAgentNumberOrEmail as vi.Mock).mockReturnValue(true);
        (isLDAPPassword as vi.Mock).mockReturnValue(false);
        (isPostcode as vi.Mock).mockReturnValue(true);

        expect(loginFormSubmit(false)).toBe(false);
    });

    it('returns false when postcode invalid despite valid agent', () => {
        mountDom();
        (isAgentNumberOrEmail as vi.Mock).mockReturnValue(true);
        (isLDAPPassword as vi.Mock).mockReturnValue(true);
        (isPostcode as vi.Mock).mockReturnValue(false);

        expect(loginFormSubmit(false)).toBe(false);
    });

    it('returns true when all validations pass and sends analytics', () => {
        mountDom({ lengthVal: '12', strengthVal: 'Good' });
        (isAgentNumberOrEmail as vi.Mock).mockReturnValue(true);
        (isLDAPPassword as vi.Mock).mockReturnValue(true);
        (isPostcode as vi.Mock).mockReturnValue(true);

        expect(loginFormSubmit(false)).toBe(true);
        expect(sendAnalyticsPasswordDetails).toHaveBeenCalledWith(12, 'Good');
    });

    it('handles cookie form ids and newCustomer flag wiring', () => {
        mountDom({ cookie: true, newCustomer: true });
        (isAgentNumberOrEmail as vi.Mock).mockReturnValue(true);
        (isLDAPPassword as vi.Mock).mockReturnValue(true);
        (isPostcode as vi.Mock).mockReturnValue(true);

        expect(loginFormSubmit(true)).toBe(true);

        const calls = (isAgentNumberOrEmail as vi.Mock).mock.calls;
        expect(calls[0][2]).toBe(true);
    });

    it('does not crash if strength inputs are missing, and does not send analytics', () => {
        mountDom({ strengthEl: false });
        (isAgentNumberOrEmail as vi.Mock).mockReturnValue(true);
        (isLDAPPassword as vi.Mock).mockReturnValue(true);
        (isPostcode as vi.Mock).mockReturnValue(true);

        expect(loginFormSubmit(false)).toBe(true);
        expect(sendAnalyticsPasswordDetails).not.toHaveBeenCalled();
    });
});