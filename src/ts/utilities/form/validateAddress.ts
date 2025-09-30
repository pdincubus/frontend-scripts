import { validateAddressLineValue, type AddressLineOptions } from './validateAddressLine.js';
import { validatePostcodeValue, type PostcodeOptions } from './validatePostcode.js';

export type AddressFields = {
    address_1: string;
    address_2?: string;
    address_3?: string;
    address_4?: string;
    city: string;
    county?: string;
    postCode: string;
};

export type AddressOptions = {
    visible?: boolean;                  // default true; if false, skip validation and return ok=true
    lineOpts?: AddressLineOptions;      // per-line options
    optionalLines?: Array<keyof AddressFields>; // which lines are optional
    postcodeOpts?: PostcodeOptions;
};

/** Pure aggregator. No DOM. */
export function validateAddress(
    fields: AddressFields,
    opts: AddressOptions = {}
): { ok: boolean; parts: Record<keyof AddressFields, boolean> } {
    const {
        visible = true,
        lineOpts = {},
        optionalLines = ['address_2', 'address_3', 'address_4', 'county'],
        postcodeOpts = {}
    } = opts;

    // if not visible, treat as valid
    if (!visible) {
        const parts: Record<keyof AddressFields, boolean> = {
            address_1: true,
            address_2: true,
            address_3: true,
            address_4: true,
            city: true,
            county: true,
            postCode: true
        };
        return { ok: true, parts };
    }

    const isOptional = new Set(optionalLines);

    const parts: Record<keyof AddressFields, boolean> = {
        address_1: validateAddressLineValue(fields.address_1 ?? '', {
            ...lineOpts,
            required: !isOptional.has('address_1')
        }).ok,
        address_2: validateAddressLineValue(fields.address_2 ?? '', {
            ...lineOpts,
            required: !isOptional.has('address_2')
        }).ok,
        address_3: validateAddressLineValue(fields.address_3 ?? '', {
            ...lineOpts,
            required: !isOptional.has('address_3')
        }).ok,
        address_4: validateAddressLineValue(fields.address_4 ?? '', {
            ...lineOpts,
            required: !isOptional.has('address_4')
        }).ok,
        city: validateAddressLineValue(fields.city ?? '', {
            ...lineOpts,
            required: !isOptional.has('city')
        }).ok,
        county: validateAddressLineValue(fields.county ?? '', {
            ...lineOpts,
            required: !isOptional.has('county')
        }).ok,
        postCode: validatePostcodeValue(fields.postCode ?? '', postcodeOpts).ok
    };

    const ok = Object.values(parts).every(Boolean);
    return { ok, parts };
}