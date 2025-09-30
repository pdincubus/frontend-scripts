import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the tabbable util exactly as the SUT imports it
vi.mock('../utilities/general/makeTabbable.js', () => ({
    makeTabbable: vi.fn()
}));
import { makeTabbable } from '../utilities/general/makeTabbable.js';

import MobileFooterNav from '../global/MobileFooterNav';

// tiny helper
function el(html: string): HTMLElement {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild as HTMLElement;
}

function setupDom() {
    const container = el(`
        <nav id="foot-nav">
            <section class="nav-section" id="s1">
                <button type="button" class="toggle" id="t1" tabindex="-1">Section 1</button>
                <div class="nav-links" id="l1">
                    <a href="#a" id="a1">A</a>
                    <button type="button" id="b1">B</button>
                    <div id="d1" tabindex="0"></div>
                </div>
            </section>
            <section class="nav-section" id="s2">
                <button type="button" class="toggle" id="t2">Section 2</button>
                <div class="nav-links" id="l2">
                    <a href="#a2" id="a2">A2</a>
                    <button type="button" id="b2">B2</button>
                    <div id="d2" tabindex="0"></div>
                </div>
            </section>
        </nav>
    `) as HTMLElement;

    const s1 = container.querySelector('#s1') as HTMLElement;
    const s2 = container.querySelector('#s2') as HTMLElement;
    const t1 = container.querySelector('#t1') as HTMLElement;
    const t2 = container.querySelector('#t2') as HTMLElement;
    const l1 = container.querySelector('#l1') as HTMLElement;
    const l2 = container.querySelector('#l2') as HTMLElement;

    document.body.append(container);

    return { container, s1, s2, t1, t2, l1, l2 };
}

beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('MobileFooterNav', () => {
    it('init sets section data heights, removes toggle tabindex, and closes all sections', () => {
        const { container, s1, s2, t1, t2, l1, l2 } = setupDom();

        vi.spyOn(l1, 'offsetHeight', 'get').mockReturnValue(111);
        vi.spyOn(l2, 'offsetHeight', 'get').mockReturnValue(222);

        const nav = new MobileFooterNav(container);

        nav.init();

        expect(l1.dataset.height).toBe('111');
        expect(l2.dataset.height).toBe('222');

        // tabindex removed from toggles
        expect(t1.hasAttribute('tabindex')).toBe(false);
        expect(t2.hasAttribute('tabindex')).toBe(false);

        // closed by default
        expect(t1.classList.contains('is_active')).toBe(false);
        expect(l1.classList.contains('is_active')).toBe(false);
        expect(l1.style.height).toBe('0px');

        expect(t2.classList.contains('is_active')).toBe(false);
        expect(l2.classList.contains('is_active')).toBe(false);
        expect(l2.style.height).toBe('0px');
    });

    it('opens a section on toggle click, then closes on second click, calling makeTabbable with correct mode', () => {
        const { container, t1, l1 } = setupDom();

        vi.spyOn(l1, 'offsetHeight', 'get').mockReturnValue(150);

        const nav = new MobileFooterNav(container);

        nav.init();

        // open
        t1.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(t1.classList.contains('is_active')).toBe(true);
        expect(t1.getAttribute('aria-expanded')).toBe('true');
        expect(l1.classList.contains('is_active')).toBe(true);
        expect(l1.style.height).toBe('150px');

        // last makeTabbable call is enable for this section's tabbables
        expect(makeTabbable).toHaveBeenLastCalledWith(
            expect.arrayContaining([
                l1.querySelector('#a1') as HTMLElement,
                l1.querySelector('#b1') as HTMLElement,
                l1.querySelector('#d1') as HTMLElement
            ]),
            'enable'
        );

        // close
        t1.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(t1.classList.contains('is_active')).toBe(false);
        expect(t1.getAttribute('aria-expanded')).toBe('false');
        expect(l1.classList.contains('is_active')).toBe(false);
        expect(l1.style.height).toBe('0px');

        expect(makeTabbable).toHaveBeenLastCalledWith(expect.any(Array), 'disable');

        // instance still alive
        expect(() => (nav as any).close(t1, l1)).not.toThrow();
    });

    it('opening one section does not affect another', () => {
        const { container, t1, t2, l1, l2 } = setupDom();

        vi.spyOn(l1, 'offsetHeight', 'get').mockReturnValue(100);
        vi.spyOn(l2, 'offsetHeight', 'get').mockReturnValue(200);

        new MobileFooterNav(container).init();

        t1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(l1.classList.contains('is_active')).toBe(true);
        expect(l2.classList.contains('is_active')).toBe(false);

        t2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(l1.classList.contains('is_active')).toBe(true);  // remains open
        expect(l2.classList.contains('is_active')).toBe(true);
    });

    it('listener added only once per toggle via data flag', () => {
        const { container, t1, l1 } = setupDom();

        vi.spyOn(l1, 'offsetHeight', 'get').mockReturnValue(80);

        const nav = new MobileFooterNav(container);

        nav.init();

        const addSpy = vi.spyOn(t1, 'addEventListener');

        // run init again, should skip because dataset.listenerAdded is set
        nav.init();

        expect(addSpy).not.toHaveBeenCalled();

        // click still works
        t1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(l1.classList.contains('is_active')).toBe(true);
    });

    it('destroy clears styles, resets toggles, and calls makeTabbable remove per section', () => {
        const { container, t1, l1, t2, l2 } = setupDom();

        vi.spyOn(l1, 'offsetHeight', 'get').mockReturnValue(70);
        vi.spyOn(l2, 'offsetHeight', 'get').mockReturnValue(90);

        const nav = new MobileFooterNav(container);

        nav.init();

        // open both
        t1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        t2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(l1.classList.contains('is_active')).toBe(true);
        expect(l2.classList.contains('is_active')).toBe(true);

        nav.destroy();

        // toggles reset
        expect(t1.classList.contains('is_active')).toBe(false);
        expect(t1.getAttribute('aria-expanded')).toBe('false');
        expect(t2.classList.contains('is_active')).toBe(false);
        expect(t2.getAttribute('aria-expanded')).toBe('false');

        // sections cleared
        expect(l1.getAttribute('style')).toBeNull();
        expect(l2.getAttribute('style')).toBeNull();

        // last calls were remove, twice
        expect(makeTabbable).toHaveBeenCalled();

        const calls = (makeTabbable as unknown as vi.Mock).mock.calls;
        const lastModes = calls.slice(-2).map(c => c[1]);

        expect(lastModes).toEqual(['remove', 'remove']);

        // click after destroy should not reopen
        t1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(l1.classList.contains('is_active')).toBe(false);
    });

    it('is safe with missing container', () => {
        // no container, constructor returns early, methods no-op
        const nav = new MobileFooterNav(null as unknown as HTMLElement);

        nav.init();
        nav.destroy();
        expect(makeTabbable).not.toHaveBeenCalled();
    });

    it('uses default lookups when args are undefined', () => {
        const { container, t1, l1 } = setupDom();

        // make sure default query finds the right node
        container.id = 'foot-nav';

        vi.spyOn(l1, 'offsetHeight', 'get').mockReturnValue(42);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nav = new MobileFooterNav(undefined as any);

        nav.init();

        t1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(l1.classList.contains('is_active')).toBe(true);
        expect(makeTabbable).toHaveBeenLastCalledWith(expect.any(Array), 'enable');
    });
});