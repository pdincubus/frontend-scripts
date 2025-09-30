import { isValidPhone } from '../../utilities/form/isValidPhone.js';
import { determineErrorDisplay } from '../../utilities/form/determineErrorDisplay.js';

type PhoneCfg = {
    selector: string;
    formId: string;
    type: 'any' | 'mobile' | 'landline';
};

export function bindContactNumbers(container: ParentNode = document): void {
    const configs: PhoneCfg[] = [
        { selector: '[data-contact-phone]', formId: 'contactPhoneNumber', type: 'landline' },
        { selector: '[data-parcelshop-phone]', formId: 'parcelshopMobilePhoneNumber', type: 'mobile' },
        { selector: '[data-customer-mobile]', formId: 'contactMobilePhoneNumber', type: 'mobile' }
    ];

    for (const cfg of configs) {
        const input = container.querySelector<HTMLInputElement>(cfg.selector);
        if (!input) continue;

        const normalise = (v: string) => v.replace(/\s+/g, '');

        const validate = () => {
            const value = normalise(input.value);
            const ok = isValidPhone(value, { type: cfg.type });
            determineErrorDisplay(ok, cfg.formId);
            return ok;
        };

        input.addEventListener('blur', validate);
    }
}