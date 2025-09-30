import { describe, it, expect, beforeEach, vi } from 'vitest';
import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay';

function setupDom() {
    document.body.innerHTML = `
        <div id="wrapper" class="field">
            <label for="email">Email</label>
            <input id="email" type="text" />
            <label class="error is_hidden" hidden for="email"></label>
        </div>

        <div id="custom-wrapper">
            <input id="name" type="text" />
            <div id="name-error" class="error-box is_hidden" hidden></div>
        </div>
    `;

    // stub scrollIntoView so it does not blow up JSDOM
    Element.prototype.scrollIntoView = vi.fn();
}

beforeEach(() => {
    setupDom();
    vi.clearAllMocks();
});

describe('determineErrorDisplay', () => {
    it('shows error on invalid, hides on valid, toggles classes and aria', () => {
        const input = document.getElementById('email') as HTMLInputElement;
        const wrapper = document.getElementById('wrapper') as HTMLElement;
        const err = document.querySelector('label.error[for="email"]') as HTMLElement;

        // invalid
        determineErrorDisplay(false, 'email', { message: 'Required' });
        expect(wrapper.classList.contains('has_error')).toBe(true);
        expect(err.classList.contains('is_hidden')).toBe(false);
        expect(err.hasAttribute('hidden')).toBe(false);
        expect(err.textContent).toBe('Required');
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(err.getAttribute('role')).toBe('alert');
        expect(err.getAttribute('aria-live')).toBe('assertive');

        // valid
        determineErrorDisplay(true, 'email');
        expect(wrapper.classList.contains('has_error')).toBe(false);
        expect(err.classList.contains('is_hidden')).toBe(true);
        expect(err.getAttribute('hidden')).toBe('hidden');
        expect(input.hasAttribute('aria-invalid')).toBe(false);
    });

    it('uses a custom error container when provided', () => {
        const err = document.getElementById('name-error') as HTMLElement;

        determineErrorDisplay(false, 'name', {
            errorContainer: '#name-error',
            fieldWrapper: '#custom-wrapper',
            message: 'Bad name'
        });

        expect(err.classList.contains('is_hidden')).toBe(false);
        expect(err.hasAttribute('hidden')).toBe(false);
        expect(err.textContent).toBe('Bad name');
        expect(document.getElementById('custom-wrapper')!.classList.contains('has_error')).toBe(true);
    });

    it('focuses the field and scrolls the error container when configured', () => {
        const input = document.getElementById('email') as HTMLInputElement;
        const focusSpy = vi.spyOn(input, 'focus');

        determineErrorDisplay(false, input, { focus: true, scrollIntoView: true });

        expect(focusSpy).toHaveBeenCalledTimes(1);
        const err = document.querySelector('label.error[for="email"]') as HTMLElement;
        expect((err.scrollIntoView as any)).toHaveBeenCalledWith({ block: 'center', behavior: 'smooth' });
    });

    it('supports custom renderer', () => {
        const err = document.getElementById('name-error') as HTMLElement;
        const render = vi.fn((el: HTMLElement, msg: string) => {
            el.innerHTML = `<span class="msg">${msg}</span>`;
        });

        determineErrorDisplay(false, 'name', {
            errorContainer: err,
            fieldWrapper: '#custom-wrapper',
            message: 'Nope',
            render
        });

        expect(render).toHaveBeenCalled();
        expect(err.querySelector('.msg')!.textContent).toBe('Nope');
    });
});