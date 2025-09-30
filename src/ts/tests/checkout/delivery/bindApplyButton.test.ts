import { describe, it, expect, beforeEach, vi } from 'vitest';
import { bindApplyButton } from '~checkout/delivery/bindApplyButton';

vi.mock('~utils/form/determineErrorDisplay.js', () => ({ determineErrorDisplay: vi.fn() }));
vi.mock('~utils/form/isValidPhone.js', () => ({ isValidPhone: vi.fn(() => true) }));
vi.mock('~utils/form/validateDeliveryInstructions.js', () => ({ validateDeliveryInstructions: vi.fn(() => true) }));

function dom() {
    document.body.innerHTML = `
        <form id="deliveryForm"></form>
        <input id="action" />
        <input id="contactPhoneNumber" value="02079460000" />
        <input id="parcelshopMobilePhoneNumber" value="07123456789" />
        <textarea id="deliveryInfo">Leave at back</textarea>
        <button data-apply id="applybutton">Apply</button>
    `;
    const form = document.getElementById('deliveryForm') as HTMLFormElement;
    form.submit = vi.fn() as any;
    return form;
}

beforeEach(() => vi.clearAllMocks());

describe('bindApplyButton', () => {
    it('submits when everything validates', () => {
        const form = dom();
        bindApplyButton();
        document.getElementById('applybutton')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect((form.submit as any)).toHaveBeenCalled();
    });
});