import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../utilities/form/determineErrorDisplay', () => ({
    determineErrorDisplay: vi.fn()
}));

import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay';
import { isAgentNumberOrEmail } from '../utilities/account/isAgentNumberOrEmail';

afterEach(() => {
    vi.clearAllMocks();
});

describe('isAgentNumberOrEmail', () => {
    const formId = 'agent-input';

    it('bypasses validation when isNewCustomer is true', () => {
        const result = isAgentNumberOrEmail(formId, 'utter-nonsense', true);

        expect(result).toBe(true);
        expect(determineErrorDisplay).not.toHaveBeenCalled();
    });

    describe('valid inputs', () => {
        it.each([
            'A1234567',                // letter + 7 digits
            'b123456789',              // letter + 9 digits
            'AB123456',                // two letters + 6 digits
            '12A12345',                // 2 digits + 1 letter + 5 digits
            '1234',                    // 4–8 digits
            '12345678',
            'user.name+tag@example.co.uk', // email with +
            'USER@EXAMPLE.COM'         // case–insensitive email
        ])('accepts %s', (input) => {
            expect(isAgentNumberOrEmail(formId, input)).toBe(true);
            expect(determineErrorDisplay).toHaveBeenLastCalledWith(true, formId);
        });
    });

    describe('invalid inputs', () => {
        it.each([
            '', 'abc', 'A123', 'ABC12345', '1234567890',
            '1A2345', 'AA1234', '123A12345',
            'user@@example.com', 'user@', '@example.com',
            'user@example', 'user.example.com'
        ])('rejects %s', (input) => {
            expect(isAgentNumberOrEmail(formId, input)).toBe(false);
            expect(determineErrorDisplay).toHaveBeenLastCalledWith(false, formId);
        });
    });
});