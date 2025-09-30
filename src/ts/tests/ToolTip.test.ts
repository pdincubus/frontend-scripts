import { describe, it, expect, beforeEach, vi } from 'vitest';
import ToolTip from '../global/ToolTip';

function html(strings: TemplateStringsArray) {
    const tpl = document.createElement('template');
    tpl.innerHTML = strings[0].trim();
    return tpl.content.firstElementChild as HTMLElement;
}

beforeEach(() => {
    document.body.innerHTML = '';
    vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('ToolTip', () => {
    it('toggles active class on click', () => {
        const container = html`<div class="tooltip"></div>`;
        const toggle = html`<button type="button" id="toggle"></button>`;
        const content = html`<div id="content"></div>`;

        document.body.append(container, toggle, content);

        const tt = new ToolTip(container, toggle, content);

        expect(container.classList.contains('is_active')).toBe(false);
        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(true);
        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(false);

        // direct calls still work
        tt.open();
        expect(container.classList.contains('is_active')).toBe(true);
        tt.close();
        expect(container.classList.contains('is_active')).toBe(false);
    });

    it('is safe when constructed without required elements, no throw, no toggle', () => {
        // All nulls, constructor returns early
        const tt = new ToolTip(null, null, null);

        // Methods should no-op without throwing
        expect(() => tt.open()).not.toThrow();
        expect(() => tt.close()).not.toThrow();
    });

    it('uses default container selector when first arg is undefined', () => {
        const container = html`<div class="tooltip" id="def"></div>`;
        const toggle = html`<a href="#" id="t1">?</a>`;
        const content = html`<div id="c1"></div>`;

        document.body.append(container, toggle, content);

        // Pass undefined so default param picks up document.querySelector('.tooltip')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tt = new ToolTip(undefined as any, toggle, content);

        toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(container.classList.contains('is_active')).toBe(true);
    });

    it('multiple instances do not interfere with each other', () => {
        const c1 = html`<div class="tooltip" id="c1"></div>`;
        const t1 = html`<button type="button" id="t1"></button>`;
        const d1 = html`<div id="d1"></div>`;
        const c2 = html`<div class="tooltip" id="c2"></div>`;
        const t2 = html`<button type="button" id="t2"></button>`;
        const d2 = html`<div id="d2"></div>`;

        document.body.append(c1, t1, d1, c2, t2, d2);

        new ToolTip(c1, t1, d1);
        new ToolTip(c2, t2, d2);

        t1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(c1.classList.contains('is_active')).toBe(true);
        expect(c2.classList.contains('is_active')).toBe(false);

        t2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(c1.classList.contains('is_active')).toBe(true);
        expect(c2.classList.contains('is_active')).toBe(true);
    });

    it('open and close are idempotent', () => {
        const container = html`<div class="tooltip"></div>`;
        const toggle = html`<button type="button"></button>`;
        const content = html`<div></div>`;

        document.body.append(container, toggle, content);

        const tt = new ToolTip(container, toggle, content);

        tt.open();
        tt.open();
        expect(container.classList.contains('is_active')).toBe(true);

        tt.close();
        tt.close();
        expect(container.classList.contains('is_active')).toBe(false);
    });
});