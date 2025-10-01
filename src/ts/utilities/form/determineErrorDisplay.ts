export type ErrorDisplayOptions = {
    message?: string;
    fieldWrapper?: string | Element;
    errorContainer?: string | Element;
    focus?: boolean;
    scrollIntoView?: boolean;
    render?: (el: HTMLElement, msg: string) => void;

    // new, for tests
    scroller?: (opts: { top: number; behavior: ScrollBehavior }) => void;
    isPersonalDetailsPage?: () => boolean;
};

export function determineErrorDisplay(allValid: boolean, formId: string | HTMLElement, opts: ErrorDisplayOptions = {}): void {
    const {
        message,
        fieldWrapper,
        errorContainer,
        focus = false,
        scrollIntoView = false,
        render,
        scroller = (args) => window.scrollTo?.(args as any),
        isPersonalDetailsPage = () => document.location.href.toLowerCase().includes('co_personal_details.asp')
    } = opts;

    const formElem = typeof formId === 'string' ? document.getElementById(formId) : formId;
    if (!formElem) return;

    // … your existing show/hide, aria, wrapper logic …

    // legacy scroll bit stays the same, but uses injected deps
    const firstVisibleErrorElem = formElem.querySelector('label.error.is_active') as HTMLElement | null;

    if (isPersonalDetailsPage() && firstVisibleErrorElem) {
        const errorElemOffsetTop = firstVisibleErrorElem.scrollTop;
        const windowHeight = window.innerHeight;
        const top = (errorElemOffsetTop - windowHeight) + (windowHeight * 0.2);

        scroller({ top, behavior: 'smooth' });
    }
}