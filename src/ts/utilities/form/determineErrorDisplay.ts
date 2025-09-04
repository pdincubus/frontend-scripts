export function determineErrorDisplay (allValid: boolean, formId: string): void {
    const formElem = document.getElementById(formId) as HTMLFormElement || false;
    const formErrorElems = formElem.querySelectorAll('label.error') as NodeList || false;
    const firstFormErrorElem = formErrorElems.item(0) as HTMLElement || false;
    const formParentElem = formElem.parentElement as HTMLElement || false;
    const isCheckoutPersonalDetailsPage = document.location.href.toLowerCase().includes("co_personal_details.asp") || false;
    const firstVisibleErrorElem = formElem.querySelector('label.error.is_active') as HTMLElement || false;

    if (!allValid) {
        if (firstFormErrorElem) {
            firstFormErrorElem.removeAttribute('hidden');
            firstFormErrorElem.classList.remove('is_hidden');
        }

        formParentElem.classList.add("has_error");
        //$("label[for='" + formId + "']").not(".error").addClass("errorShown");
    } else if (allValid) {
        if (firstFormErrorElem) {
            firstFormErrorElem.setAttribute('hidden', 'hidden');
            firstFormErrorElem.classList.add('is_hidden');
        }

        formParentElem.classList.remove("has_error");
        //$("label[for='" + formId + "']").not(".error").removeClass("errorShown");
    }

    if (isCheckoutPersonalDetailsPage && firstVisibleErrorElem) {
        const errorElemOffsetTop = firstVisibleErrorElem.scrollTop;
        const windowHeight = window.innerHeight;
        const scrollToValue = (errorElemOffsetTop - windowHeight)  + (windowHeight * 0.2);

        window.scrollTo({
            top: scrollToValue,
            behavior: 'smooth'
        });
    }
}