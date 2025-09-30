import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the tabbable util exactly as the SUT imports it
vi.mock('../utilities/general/makeTabbable.js', () => ({
    makeTabbable: vi.fn()
}));
import { makeTabbable } from '../utilities/general/makeTabbable.js';

import MobileNav from '../global/MobileNav';

function el(html: string): HTMLElement {
    const tpl = document.createElement('template');

    tpl.innerHTML = html.trim();

    return tpl.content.firstElementChild as HTMLElement;
}

function setupDom() {
    const container = el(`
        <nav id="main-nav">
            <a href="#a" id="lnk">A</a>
            <button id="btn" type="button">B</button>
            <div tabindex="0" id="tab0"></div>
        </nav>
    `);

    const toggle = el(`<button id="main-nav-toggle" type="button">menu</button>`);
    const closeToggle = el(`<button id="main-nav-close" type="button">close</button>`);

    document.body.append(container, toggle, closeToggle);

    return { container, toggle, closeToggle };
}

beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('MobileNav', () => {
    it('initialises, sets nav height data, closes by default, and sets aria-live', () => {
        const { container, toggle, closeToggle } = setupDom();

        // stub height before init runs
        const hSpy = vi
            .spyOn(container, 'offsetHeight', 'get')
            .mockReturnValue(123);

        const nav = new MobileNav(container, toggle, closeToggle);

        nav.init();

        expect(container.dataset.height).toBe('123');
        expect(container.getAttribute('aria-live')).toBe('assertive');
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        expect(container.classList.contains('is_active')).toBe(false);
        expect(container.style.height).toBe('0px');

        hSpy.mockRestore();
    });

    it('opens on toggle click, then closes on second click, calling makeTabbable correctly', () => {
        const { container, toggle, closeToggle } = setupDom();

        vi.spyOn(container, 'offsetHeight', 'get').mockReturnValue(200);

        const nav = new MobileNav(container, toggle, closeToggle);

        nav.init();

        // first click opens
        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(toggle.classList.contains('is_active')).toBe(true);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        expect(container.classList.contains('is_active')).toBe(true);
        expect(container.style.height).toBe('200px');
        expect(makeTabbable).toHaveBeenLastCalledWith(
            expect.arrayContaining([
                container.querySelector('#lnk') as HTMLElement,
                container.querySelector('#btn') as HTMLElement,
                container.querySelector('#tab0') as HTMLElement
            ]),
            'enable'
        );

        // second click closes
        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(toggle.classList.contains('is_active')).toBe(false);
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        expect(container.classList.contains('is_active')).toBe(false);
        expect(container.style.height).toBe('0px');
        expect(makeTabbable).toHaveBeenLastCalledWith(
            expect.any(Array),
            'disable'
        );

        // leaves instance usable
        expect(() => (nav as any).open()).not.toThrow();
    });

    it('closes when Escape is pressed', () => {
        const { container, toggle, closeToggle } = setupDom();

        vi.spyOn(container, 'offsetHeight', 'get').mockReturnValue(50);

        new MobileNav(container, toggle, closeToggle).init();

        // open
        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(true);

        // Esc closes
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(false);
    });

    it('close button triggers close', () => {
        const { container, toggle, closeToggle } = setupDom();

        vi.spyOn(container, 'offsetHeight', 'get').mockReturnValue(10);

        new MobileNav(container, toggle, closeToggle).init();

        // open
        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(true);

        // click close
        closeToggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(false);
        expect(makeTabbable).toHaveBeenLastCalledWith(expect.any(Array), 'disable');
    });

    it('destroy removes ARIA and style, resets toggle, and calls makeTabbable remove', () => {
        const { container, toggle, closeToggle } = setupDom();

        vi.spyOn(container, 'offsetHeight', 'get').mockReturnValue(77);

        const nav = new MobileNav(container, toggle, closeToggle);

        nav.init();

        // open once so classes and attrs are set
        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(true);

        nav.destroy();

        expect(container.getAttribute('aria-live')).toBeNull();
        expect(container.getAttribute('style')).toBeNull();
        expect(toggle.classList.contains('is_active')).toBe(false);
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        expect(makeTabbable).toHaveBeenLastCalledWith(expect.any(Array), 'remove');

        // future calls no-op
        (nav as any).open();
        (nav as any).close();
        expect(container.classList.contains('is_active')).toBe(false);
    });

    it('binds toggle listeners only once using the data flag', () => {
        const { container, toggle, closeToggle } = setupDom();

        vi.spyOn(container, 'offsetHeight', 'get').mockReturnValue(33);

        const nav = new MobileNav(container, toggle, closeToggle);

        nav.init();

        const addEventListenerSpy = vi.spyOn(toggle, 'addEventListener');

        // calling init again should not add listeners again
        nav.init();
        expect(addEventListenerSpy).not.toHaveBeenCalled();

        // clicking still works
        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(true);
    });

    it('is safe when constructed with missing elements', () => {
        // all nulls, constructor exits, isReady stays false
        const nav = new MobileNav(null, null, null);

        // methods should no-op, no throws, and no makeTabbable calls
        (nav as any).init?.();
        (nav as any).open?.();
        (nav as any).close?.();
        nav.destroy?.();

        expect(makeTabbable).not.toHaveBeenCalled();
    });

    it('uses default element lookups when args are undefined', () => {
        const { container, toggle, closeToggle } = setupDom();

        // make them discoverable via getElementById
        container.id = 'main-nav';
        toggle.id = 'main-nav-toggle';
        closeToggle.id = 'main-nav-close';

        vi.spyOn(container, 'offsetHeight', 'get').mockReturnValue(19);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nav = new MobileNav(undefined as any, undefined as any, undefined as any);

        nav.init();

        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(true);
        expect(makeTabbable).toHaveBeenLastCalledWith(expect.any(Array), 'enable');
    });
});