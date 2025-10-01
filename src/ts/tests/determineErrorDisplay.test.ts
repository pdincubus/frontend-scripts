import { describe, it, expect, vi } from 'vitest';
import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay';

it('calls scroller when page detector is true and an active error exists', () => {
    document.body.innerHTML = `
        <div id="wrap">
            <label class="error is_active" id="err">Oops</label>
        </div>
    `;
    const scroller = vi.fn();
    const isPersonalDetailsPage = () => true;

    determineErrorDisplay(false, 'wrap', { scroller, isPersonalDetailsPage });

    expect(scroller).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));
});

it('does not call scroller when detector is false', () => {
    document.body.innerHTML = `<div id="wrap"><label class="error is_active">Oops</label></div>`;
    const scroller = vi.fn();

    determineErrorDisplay(false, 'wrap', { scroller, isPersonalDetailsPage: () => false });

    expect(scroller).not.toHaveBeenCalled();
});