import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('~utils/form/validateDeliveryInstructions.js', () => ({
    validateDeliveryInstructions: vi.fn(() => true)
}));

import { validateDeliveryInstructions } from '~utils/form/validateDeliveryInstructions.js';
import { bindDeliveryInstructions } from '~checkout/delivery/bindDeliveryInstructions';

function dom() {
    document.body.innerHTML = `
        <textarea id="deliveryInfo" data-delivery-instructions>Leave in shed</textarea>
    `;
}

beforeEach(() => {
    vi.clearAllMocks();
    dom();
});

describe('bindDeliveryInstructions', () => {
    it('calls validateDeliveryInstructions on blur with sensible defaults', () => {
        bindDeliveryInstructions();
        const ta = document.getElementById('deliveryInfo') as HTMLTextAreaElement;
        ta.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

        expect(validateDeliveryInstructions).toHaveBeenCalledWith('deliveryInfo', 'Leave in shed', {
            required: false,
            maxLength: 500
        });
    });

    it('no crash if textarea missing', () => {
        document.body.innerHTML = '';
        expect(() => bindDeliveryInstructions()).not.toThrow();
    });
});