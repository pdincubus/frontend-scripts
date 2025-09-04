/**
 * Toggle tabbability on a collection of focusable elements.
 *
 * Modes:
 * - 'enable': restores original tabindex or removes it if none was set
 * - 'disable': sets tabindex="-1" and stores previous value
 * - 'remove': removes tabindex and any stored value entirely
 */
export function makeTabbable(
    elements: Iterable<HTMLElement>,
    mode: 'enable' | 'disable' | 'remove'
): void {
    console.log('makeTabbable:', elements, mode);

    for (const elem of elements) {
        switch (mode) {
            case 'enable': {
                const prev = elem.getAttribute('data-prev-tabindex');

                if (prev === null || prev === '') {
                    elem.removeAttribute('tabindex');
                } else {
                    elem.setAttribute('tabindex', prev);
                }

                elem.removeAttribute('data-prev-tabindex');

                break;
            }

            case 'disable': {
                if (!elem.hasAttribute('data-prev-tabindex')) {
                    const current = elem.getAttribute('tabindex');
                    elem.setAttribute('data-prev-tabindex', current ?? '');
                }

                elem.setAttribute('tabindex', '-1');

                break;
            }

            case 'remove': {
                elem.removeAttribute('tabindex');
                elem.removeAttribute('data-prev-tabindex');

                break;
            }
        }
    }
}