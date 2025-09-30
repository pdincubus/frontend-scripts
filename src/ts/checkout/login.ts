import { loginFormSubmit } from "../utilities/account/loginFormSubmit.js";
import { PasswordStrength } from "../global/PasswordStrength.js";

// If other parts of the page poke this later, keep the instance.
// Otherwise you can remove it.
const passwordStrength = new PasswordStrength();

function getEl<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

export function initLoginPage(): void {
    const nonCookieLoginForm = getEl<HTMLFormElement>("nonCookieLoginForm");
    const nonCookieLoginUsernameInput = getEl<HTMLInputElement>("nonCookieLoginAccountNo");

    const cookieLoginForm = getEl<HTMLFormElement>("cookieLoginForm");
    const cookieLoginPasswordInput = getEl<HTMLInputElement>("cookieLoginLDAPPassword");

    const actionInput = getEl<HTMLInputElement>("action");
    const passwordInput = getEl<HTMLInputElement>("password");
    const newCustomerInput = getEl<HTMLInputElement>("newCustomerRadio");
    const loginAccountNumberValidation = getEl<HTMLElement>("loginAccountNumberValidation");
    const registerLink = getEl<HTMLElement>("checkout-register-account-link");

    // Focus helpers
    if (cookieLoginPasswordInput && cookieLoginPasswordInput.value.length > 0) {
        cookieLoginPasswordInput.focus();
    } else if (nonCookieLoginUsernameInput && nonCookieLoginUsernameInput.value.length > 0) {
        nonCookieLoginUsernameInput.focus();
    }

    // Hide password if "new customer" is checked at load
    if (newCustomerInput?.checked && passwordInput) {
        passwordInput.setAttribute("hidden", "hidden");
    }

    // Clicking new customer hides the account number validation hint
    if (newCustomerInput && loginAccountNumberValidation) {
        newCustomerInput.addEventListener("click", () => {
            loginAccountNumberValidation.setAttribute("hidden", "hidden");
        });
    }

    // Cookie form submit
    if (cookieLoginForm) {
        cookieLoginForm.addEventListener("submit", (e: SubmitEvent) => {
            // Let the util decide validity
            const ok = loginFormSubmit(true);
            if (!ok) {
                e.preventDefault();
                return;
            }
            // If ok, allow the native submit to proceed
        });
    }

    // Non-cookie form submit
    if (nonCookieLoginForm) {
        nonCookieLoginForm.addEventListener("submit", (e: SubmitEvent) => {
            const ok = loginFormSubmit(false);
            if (!ok) {
                e.preventDefault();
                return;
            }
        });
    }

    // Register link submits the appropriate form with action=no
    if (registerLink && actionInput) {
        registerLink.addEventListener("click", (e: MouseEvent) => {
            e.preventDefault();
            actionInput.value = "no";

            if (cookieLoginForm) {
                cookieLoginForm.submit();
            } else if (nonCookieLoginForm) {
                nonCookieLoginForm.submit();
            }
        });
    }
}

// Auto-init on DOM ready when included directly on the page
if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", () => initLoginPage());
} else {
    initLoginPage();
}