import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('~utils/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));
vi.mock('~utils/form/isValidPhone.js', () => ({
    isValidPhone: vi.fn(() => true)
}));

import { determineErrorDisplay } from '~utils/form/determineErrorDisplay.js';
import { isValidPhone } from '~utils/form/isValidPhone.js';
import { bindContactNumbers } from '~checkout/delivery/bindContactNumbers';

function dom() {
    document.body.innerHTML = `
        <input id="contactPhoneNumber" data-contact-phone value="020 7946 0000" />
        <input id="parcelshopMobilePhoneNumber" data-parcelshop-phone value="07123 456 789" />
        <input id="contactMobilePhoneNumber" data-customer-mobile value="07911 123 456" />
    `;
}

beforeEach(() => {
    vi.clearAllMocks();
    dom();
});

describe('bindContactNumbers', () => {
    it('wires blur handlers and validates each field with correct type', () => {
        bindContactNumbers();

        // trigger blur on each field
        (document.getElementById('contactPhoneNumber') as HTMLInputElement)
            .dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        (document.getElementById('parcelshopMobilePhoneNumber') as HTMLInputElement)
            .dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        (document.getElementById('contactMobilePhoneNumber') as HTMLInputElement)
            .dispatchEvent(new FocusEvent('blur', { bubbles: true }));

        // called three times
        expect((isValidPhone as any).mock.calls.length).toBe(3);

        const args = (isValidPhone as any).mock.calls;

        // spaces removed before validation
        expect(args[0][0]).toBe('02079460000');
        expect(args[1][0]).toBe('07123456789');
        expect(args[2][0]).toBe('07911123456');

        // types
        expect(args[0][1]).toEqual({ type: 'landline' });
        expect(args[1][1]).toEqual({ type: 'mobile' });
        expect(args[2][1]).toEqual({ type: 'mobile' });

        // error piping
        expect((determineErrorDisplay as any).mock.calls.length).toBe(3);
        expect((determineErrorDisplay as any).mock.calls[0]).toEqual([true, 'contactPhoneNumber']);
        expect((determineErrorDisplay as any).mock.calls[1]).toEqual([true, 'parcelshopMobilePhoneNumber']);
        expect((determineErrorDisplay as any).mock.calls[2]).toEqual([true, 'contactMobilePhoneNumber']);
    });

    it('marks invalid when validator returns false', () => {
        (isValidPhone as any).mockImplementationOnce(() => false);

        bindContactNumbers();

        (document.getElementById('contactPhoneNumber') as HTMLInputElement)
            .dispatchEvent(new FocusEvent('blur', { bubbles: true }));

        expect(determineErrorDisplay).toHaveBeenCalledWith(false, 'contactPhoneNumber');
    });
});