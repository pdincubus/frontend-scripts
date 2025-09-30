import { describe, it, expect, beforeEach, vi } from 'vitest';
import Alert from '../global/Alert';

function el(html: string): HTMLElement {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild as HTMLElement;
}

beforeEach(() => {
    document.body.innerHTML = '';
    vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('Alert', () => {
    it('removes active class on toggle click', () => {
        const container = el(`<div class="tooltip is_active" id="alert"></div>`);
        const toggle = el(`<button type="button" id="alert-close">close</button>`);

        document.body.append(container, toggle);

        // auto-init in constructor
        new Alert(container, toggle);

        // sanity
        expect(container.classList.contains('is_active')).toBe(true);

        // click closes
        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(false);
    });

    it('close() works directly', () => {
        const container = el(`<div class="tooltip is_active"></div>`);
        const toggle = el(`<button type="button"></button>`);

        document.body.append(container, toggle);

        const alert = new Alert(container, toggle);

        alert.close();
        expect(container.classList.contains('is_active')).toBe(false);
    });

    it('uses default container selector when first arg is undefined', () => {
        const container = el(`<div class="tooltip is_active" id="default-alert"></div>`);
        const toggle = el(`<a href="#" id="default-toggle">x</a>`);

        document.body.append(container, toggle);

        // pass undefined so the default document.querySelector('.tooltip') is used
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Alert(undefined as any, toggle);

        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(false);
    });

    it('honours a custom active class', () => {
        const container = el(`<div class="tooltip is_shown"></div>`);
        const toggle = el(`<button type="button"></button>`);

        document.body.append(container, toggle);

        new Alert(container, toggle, 'is_shown');

        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_shown')).toBe(false);
    });

    it('is safe when constructed without elements', () => {
        // all nulls, constructor returns early
        const alert = new Alert(null, null);

        // methods no-op without throwing
        expect(() => alert.close()).not.toThrow();
    });
});