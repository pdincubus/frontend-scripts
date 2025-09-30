import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../utilities/form/isValidAddressLine.js', async () => {
    const actual = await vi.importActual<any>('../utilities/form/isValidAddressLine.js');
    return {
        ...actual,
        isValidAddressLine: vi.fn() // stub only this, keep normaliseAddressLine real
    };
});

vi.mock('../utilities/form/isValidPostcode.js', () => ({
    isValidPostcode: vi.fn()
}));

import { isValidAddressLine } from '../utilities/form/isValidAddressLine.js';
import { isValidPostcode } from '../utilities/form/isValidPostcode.js';
import { validateAddress } from '../utilities/form/validateAddress';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('validateAddress (pure aggregator)', () => {
    it('returns ok=true when not visible', () => {
        const r = validateAddress(
            {
                address_1: '',
                city: '',
                postCode: ''
            } as any,
            { visible: false }
        );
        expect(r.ok).toBe(true);
        expect(Object.values(r.parts).every(Boolean)).toBe(true);
    });

    it('validates required lines and postcode', () => {
        (isValidAddressLine as vi.Mock).mockReturnValue(true);
        (isValidPostcode as vi.Mock).mockReturnValue(true);

        const r = validateAddress({
            address_1: '10 Downing Street',
            address_2: '',
            address_3: '',
            address_4: '',
            city: 'London',
            county: '',
            postCode: 'SW1A 2AA'
        });

        expect(r.ok).toBe(true);
        expect(r.parts.address_1).toBe(true);
        expect(r.parts.city).toBe(true);
        expect(r.parts.postCode).toBe(true);
    });

    it('fails when a required line is empty', () => {
        (isValidAddressLine as vi.Mock).mockReturnValue(true);
        (isValidPostcode as vi.Mock).mockReturnValue(true);

        const r = validateAddress({
            address_1: '',          // required
            address_2: '',
            address_3: '',
            address_4: '',
            city: 'London',
            county: '',
            postCode: 'SW1A 2AA'
        });

        expect(r.ok).toBe(false);
        expect(r.parts.address_1).toBe(false);
    });

    it('treats configured optional lines as optional', () => {
        (isValidAddressLine as vi.Mock).mockReturnValue(true);
        (isValidPostcode as vi.Mock).mockReturnValue(true);

        const r = validateAddress(
            {
                address_1: '221B Baker Street',
                address_2: '',
                address_3: '',
                address_4: '',
                city: 'London',
                county: '',
                postCode: 'NW1 6XE'
            },
            { optionalLines: ['address_2', 'address_3', 'address_4', 'county'] }
        );

        expect(r.ok).toBe(true);
        expect(r.parts.address_2).toBe(true);
    });

    it('fails on invalid postcode', () => {
        (isValidAddressLine as vi.Mock).mockReturnValue(true);
        (isValidPostcode as vi.Mock).mockReturnValue(false);

        const r = validateAddress({
            address_1: '10 Downing Street',
            city: 'London',
            postCode: 'INVALID'
        } as any);

        expect(r.ok).toBe(false);
        expect(r.parts.postCode).toBe(false);
    });
});