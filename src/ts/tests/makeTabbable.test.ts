import { describe, it, expect, beforeEach } from 'vitest';
import { makeTabbable } from '../utilities/general/makeTabbable';

function el(tag = 'button'): HTMLElement {
    const e = document.createElement(tag);
    // make it naturally focusable in happy-dom
    if (tag === 'button') e.setAttribute('type', 'button');
    return e;
}

function attrs(node: HTMLElement) {
    return {
        tabindex: node.getAttribute('tabindex'),
        prev: node.getAttribute('data-prev-tabindex')
    };
}

describe('makeTabbable', () => {
    let a: HTMLElement;
    let b: HTMLElement;
    let c: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        a = el(); // no tabindex originally
        b = el();
        c = el();

        b.setAttribute('tabindex', '0');
        c.setAttribute('tabindex', '2');

        document.body.append(a, b, c);
    });

    it('disables elements, storing previous tabindex values', () => {
        makeTabbable([a, b, c], 'disable');

        expect(attrs(a)).toEqual({ tabindex: '-1', prev: '' });
        expect(attrs(b)).toEqual({ tabindex: '-1', prev: '0' });
        expect(attrs(c)).toEqual({ tabindex: '-1', prev: '2' });
    });

    it('enables elements, restoring previous values or removing tabindex if none', () => {
        makeTabbable([a, b, c], 'disable');
        makeTabbable([a, b, c], 'enable');

        expect(attrs(a)).toEqual({ tabindex: null, prev: null });
        expect(attrs(b)).toEqual({ tabindex: '0', prev: null });
        expect(attrs(c)).toEqual({ tabindex: '2', prev: null });
    });

    it('second disable does not overwrite stored previous value', () => {
        makeTabbable([b], 'disable');
        // mutate current tabindex to a fake value to check it is not saved again
        b.setAttribute('tabindex', '99');
        makeTabbable([b], 'disable');

        expect(attrs(b)).toEqual({ tabindex: '-1', prev: '0' });
    });

    it('remove clears tabindex and any stored value entirely', () => {
        makeTabbable([a, b, c], 'disable');
        makeTabbable([a, b, c], 'remove');

        expect(attrs(a)).toEqual({ tabindex: null, prev: null });
        expect(attrs(b)).toEqual({ tabindex: null, prev: null });
        expect(attrs(c)).toEqual({ tabindex: null, prev: null });
    });

    it('accepts any iterable of HTMLElements, such as a Set', () => {
        const s = new Set<HTMLElement>([a, b]);

        makeTabbable(s, 'disable');

        expect(attrs(a)).toEqual({ tabindex: '-1', prev: '' });
        expect(attrs(b)).toEqual({ tabindex: '-1', prev: '0' });
    });

    it('enable does nothing harmful if called on fresh elements', () => {
        // a has no tabindex, b starts with tabindex="0"
        makeTabbable([a, b], 'enable');

        expect(attrs(a)).toEqual({ tabindex: null, prev: null });
        expect(attrs(b)).toEqual({ tabindex: '0', prev: null });
    });

    it('disable → enable roundtrip restores original values', () => {
        a.setAttribute('tabindex', '5');
        makeTabbable([a, b, c], 'disable');
        makeTabbable([a, b, c], 'enable');

        expect(attrs(a)).toEqual({ tabindex: '5', prev: null });
        expect(attrs(b)).toEqual({ tabindex: '0', prev: null });
        expect(attrs(c)).toEqual({ tabindex: '2', prev: null });
    });
});