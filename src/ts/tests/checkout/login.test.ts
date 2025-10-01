import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("~utils/account/loginFormSubmit.js", () => ({
    loginFormSubmit: vi.fn(() => true)
}));
vi.mock("../../global/PasswordStrength.js", () => ({
    PasswordStrength: vi.fn().mockImplementation(() => ({}))
}));

import { loginFormSubmit } from "~utils/account/loginFormSubmit.js";
import { initLoginPage } from "~checkout/login";

function setupDom(opts: {
    cookie?: boolean;
    nonCookie?: boolean;
    newCustomerChecked?: boolean;
    cookiePwdValue?: string;
    nonCookieUserValue?: string;
} = {}) {
    const {
        cookie = true,
        nonCookie = true,
        newCustomerChecked = false,
        cookiePwdValue = "",
        nonCookieUserValue = ""
    } = opts;

    document.body.innerHTML = `
        ${cookie ? `
            <form id="cookieLoginForm"></form>
            <input id="cookieLoginLDAPPassword" value="${cookiePwdValue}" />
        ` : ``}

        ${nonCookie ? `
            <form id="nonCookieLoginForm"></form>
            <input id="nonCookieLoginAccountNo" value="${nonCookieUserValue}" />
        ` : ``}

        <input id="password" />
        <input id="action" />
        <input id="newCustomerRadio" type="radio" ${newCustomerChecked ? "checked" : ""} />
        <div id="loginAccountNumberValidation"></div>
        <a id="checkout-register-account-link" href="#">Register</a>
    `;

    // Stub .submit so we can assert
    const cookieForm = document.getElementById("cookieLoginForm") as HTMLFormElement | null;
    const nonCookieForm = document.getElementById("nonCookieLoginForm") as HTMLFormElement | null;
    if (cookieForm) cookieForm.submit = vi.fn() as any;
    if (nonCookieForm) nonCookieForm.submit = vi.fn() as any;

    return { cookieForm, nonCookieForm };
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe("login page wiring", () => {
    it("focuses cookie password if it has a value, otherwise focuses non-cookie username", () => {
        setupDom({ cookiePwdValue: "xyz", nonCookieUserValue: "abc" });

        const focusSpyCookie = vi.spyOn((document.getElementById("cookieLoginLDAPPassword") as HTMLInputElement), "focus");
        const focusSpyUser = vi.spyOn((document.getElementById("nonCookieLoginAccountNo") as HTMLInputElement), "focus");

        initLoginPage();

        expect(focusSpyCookie).toHaveBeenCalledTimes(1);
        expect(focusSpyUser).not.toHaveBeenCalled();
    });

    it("hides password field if new customer radio is checked on load", () => {
        setupDom({ newCustomerChecked: true });
        initLoginPage();

        const pwd = document.getElementById("password") as HTMLInputElement;

        expect(pwd.getAttribute("hidden")).toBe("hidden");
    });

    it("clears login account validation hint when new customer clicked", () => {
        setupDom();
        initLoginPage();

        const hint = document.getElementById("loginAccountNumberValidation")!;
        const radio = document.getElementById("newCustomerRadio")!;

        radio.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(hint.getAttribute("hidden")).toBe("hidden");
    });

    it("cookie form submit calls loginFormSubmit(true) and allows submit when ok", () => {
        const { cookieForm } = setupDom({ cookie: true, nonCookie: false });

        initLoginPage();

        (loginFormSubmit as any).mockReturnValueOnce(true);
        cookieForm!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

        expect(loginFormSubmit).toHaveBeenCalledWith(true);
        expect((cookieForm!.submit as any)).not.toHaveBeenCalled(); // native submit proceeds, we did not prevent
    });

    it("cookie form submit prevents default when validation fails", () => {
        const { cookieForm } = setupDom({ cookie: true, nonCookie: false });

        initLoginPage();

        (loginFormSubmit as any).mockReturnValueOnce(false);

        const prevented = !cookieForm!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

        expect(loginFormSubmit).toHaveBeenCalledWith(true);
        expect(prevented).toBe(true);
    });

    it("non-cookie form submit calls loginFormSubmit(false)", () => {
        const { nonCookieForm } = setupDom({ cookie: false, nonCookie: true });

        initLoginPage();

        (loginFormSubmit as any).mockReturnValueOnce(true);
        nonCookieForm!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

        expect(loginFormSubmit).toHaveBeenCalledWith(false);
    });

    it("register link sets action=no then submits existing form", () => {
        const { cookieForm } = setupDom({ cookie: true, nonCookie: false });

        initLoginPage();

        (document.getElementById("checkout-register-account-link") as HTMLElement)
            .dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect((document.getElementById("action") as HTMLInputElement).value).toBe("no");
        expect((cookieForm!.submit as any)).toHaveBeenCalledTimes(1);
    });

    it("focuses non-cookie username when cookie password is empty", () => {
        setupDom({ cookiePwdValue: "", nonCookieUserValue: "abc" });

        const focusCookie = vi.spyOn(
            document.getElementById("cookieLoginLDAPPassword") as HTMLInputElement,
            "focus"
        );

        const focusUser = vi.spyOn(
            document.getElementById("nonCookieLoginAccountNo") as HTMLInputElement,
            "focus"
        );

        initLoginPage();

        expect(focusUser).toHaveBeenCalledTimes(1);
        expect(focusCookie).not.toHaveBeenCalled();
    });

    it("does not throw when no forms are present", () => {
        setupDom({ cookie: false, nonCookie: false });
        expect(() => initLoginPage()).not.toThrow();
    });

    it("non-cookie form submit prevents default when validation fails", () => {
        const { nonCookieForm } = setupDom({ cookie: false, nonCookie: true });

        initLoginPage();

        (loginFormSubmit as any).mockReturnValueOnce(false);

        const prevented = !nonCookieForm!.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true })
        );

        expect(loginFormSubmit).toHaveBeenCalledWith(false);
        expect(prevented).toBe(true);
    });

    it("register link submits non-cookie form when cookie form is absent", () => {
        const { nonCookieForm } = setupDom({ cookie: false, nonCookie: true });

        initLoginPage();

        (document.getElementById("checkout-register-account-link") as HTMLElement)
            .dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect((document.getElementById("action") as HTMLInputElement).value).toBe("no");
        expect((nonCookieForm!.submit as any)).toHaveBeenCalledTimes(1);
    });

    /**
     * Optional: guard against accidental double-binding if init runs twice.
     * We don't de-dupe in code, so this asserts the current behaviour.
     * If you later add a guard, flip the expectation to 1 call instead of 2.
     */
    it("calling init twice attaches two listeners to cookie form submit", () => {
        const { cookieForm } = setupDom({ cookie: true, nonCookie: false });

        initLoginPage();
        initLoginPage();

        (loginFormSubmit as any).mockReturnValue(true);
        cookieForm!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

        // If you add de-dupe later, change to toHaveBeenCalledTimes(1)
        expect(loginFormSubmit).toHaveBeenCalledTimes(2);
    });
});