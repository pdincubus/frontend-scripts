export type DetermineErrorOptions = {
    // Where to show the message. If omitted, we try sensible defaults.
    // Accepts a selector string or an element.
    errorContainer?: string | HTMLElement;
    // Optional message to render into the error container.
    message?: string;

    // Classnames
    showClass?: string;        // applied to error container on invalid
    hideClass?: string;        // applied to error container on valid
    fieldErrorClass?: string;  // applied to a wrapper on invalid

    // How to locate a wrapper to receive fieldErrorClass.
    // If not provided we use the field's parentElement.
    fieldWrapper?: string | HTMLElement;

    // Accessibility flags
    setAriaInvalid?: boolean;  // default true
    ariaRole?: 'alert' | 'status'; // default 'alert'
    ariaLive?: 'assertive' | 'polite'; // default 'assertive'

    // Behaviour
    focus?: boolean;           // focus the field on invalid, default false
    scrollIntoView?: boolean;  // scroll the error container into view on invalid, default false

    // Custom renderer for error content, receives container and message
    render?: (container: HTMLElement, message: string) => void;

    // Fallback query used if errorContainer is not supplied.
    // We try, in order: [data-error-for="{id}"], label.error[for="{id}"], then this selector within the wrapper.
    fallbackErrorSelector?: string; // default 'label.error'
};

/**
 * Generic error display utility.
 * Pass the field id or element. It will find an error container and toggle classes, aria, and behaviours.
 */
export function determineErrorDisplay(allValid: boolean, field: string | HTMLElement, opts: DetermineErrorOptions = {}): void {
    const {
        errorContainer,
        message,
        showClass = 'is_active',
        hideClass = 'is_hidden',
        fieldErrorClass = 'has_error',
        fieldWrapper,
        setAriaInvalid = true,
        ariaRole = 'alert',
        ariaLive = 'assertive',
        focus = false,
        scrollIntoView = false,
        render,
        fallbackErrorSelector = 'label.error'
    } = opts;

    const fieldEl = typeof field === 'string' ? document.getElementById(field) as HTMLElement | null : field;
    if (!fieldEl) return;

    // Pick a wrapper to take the field error class
    const wrapperEl =
        typeof fieldWrapper === 'string'
            ? (document.querySelector(fieldWrapper) as HTMLElement | null)
            : fieldWrapper || fieldEl.parentElement;

    // Resolve the error container
    let errorEl: HTMLElement | null = null;

    if (typeof errorContainer === 'string') {
        errorEl = document.querySelector(errorContainer) as HTMLElement | null;
    } else if (errorContainer instanceof HTMLElement) {
        errorEl = errorContainer;
    } else {
        // Try common patterns
        const id = fieldEl.getAttribute('id') || '';
        errorEl =
            (id ? (document.querySelector(`[data-error-for="${id}"]`) as HTMLElement | null) : null)
            || (id ? (document.querySelector(`label.error[for="${id}"]`) as HTMLElement | null) : null)
            || (wrapperEl ? (wrapperEl.querySelector(fallbackErrorSelector) as HTMLElement | null) : null);
    }

    // Toggle aria-invalid on the field
    if (setAriaInvalid) {
        if (allValid) fieldEl.removeAttribute('aria-invalid');
        else fieldEl.setAttribute('aria-invalid', 'true');
    }

    // Toggle wrapper class
    if (wrapperEl) {
        if (allValid) wrapperEl.classList.remove(fieldErrorClass);
        else wrapperEl.classList.add(fieldErrorClass);
    }

    // Update error container visibility and content
    if (errorEl) {
        // Role and live region to announce changes
        errorEl.setAttribute('role', ariaRole);
        errorEl.setAttribute('aria-live', ariaLive);

        if (message !== undefined) {
            if (render) render(errorEl, message);
            else errorEl.textContent = message;
        }

        if (allValid) {
            errorEl.classList.add(hideClass);
            errorEl.classList.remove(showClass);
            errorEl.setAttribute('hidden', 'hidden');
        } else {
            errorEl.classList.remove(hideClass);
            errorEl.classList.add(showClass);
            errorEl.removeAttribute('hidden');

            if (focus) {
                // Focus the field if possible
                if (typeof (fieldEl as any).focus === 'function') {
                    (fieldEl as any).focus();
                }
            }

            if (scrollIntoView && typeof (errorEl as any).scrollIntoView === 'function') {
                errorEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
        }
    }
}