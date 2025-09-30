import { describe, it, expect, beforeEach } from 'vitest';
import { bindSafePlace } from '~checkout/delivery/bindSafePlace';

function dom() {
    document.body.innerHTML = `
        <select id="safePlaceSelect" data-safeplace-select>
            <option value="">Choose</option>
            <option value="Z:Other">Other</option>
        </select>
        <input id="other" data-safeplace-other class="is_hidden" />
    `;
}

beforeEach(() => dom());

describe('bindSafePlace', () => {
    it('shows and hides the other field based on selection', () => {
        bindSafePlace();
        const sel = document.getElementById('safePlaceSelect') as HTMLSelectElement;
        const other = document.getElementById('other') as HTMLElement;

        expect(other.classList.contains('is_hidden')).toBe(true);

        sel.value = 'Z:Other';
        sel.dispatchEvent(new Event('change'));
        expect(other.classList.contains('is_hidden')).toBe(false);

        sel.value = '';
        sel.dispatchEvent(new Event('change'));
        expect(other.classList.contains('is_hidden')).toBe(true);
    });
});