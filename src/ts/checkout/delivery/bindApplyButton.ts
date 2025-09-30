import { determineErrorDisplay } from "~utils/form/determineErrorDisplay.js";
import { validateDeliveryInstructions } from "~utils/form/validateDeliveryInstructions.js";
import { isValidPhone } from "~utils/form/isValidPhone.js";

export function bindApplyButton(container: ParentNode = document): void {
    const btn = container.querySelector<HTMLButtonElement>('[data-apply]');
    const form = document.getElementById('deliveryForm') as HTMLFormElement | null;
    const action = document.getElementById('action') as HTMLInputElement | null;

    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();

        let ok = true;

        // Contact numbers
        const pairs: Array<{ id: string; type: 'mobile' | 'landline' | 'any' }> = [
            { id: 'contactPhoneNumber', type: 'landline' },
            { id: 'parcelshopMobilePhoneNumber', type: 'mobile' },
            { id: 'contactMobilePhoneNumber', type: 'mobile' }
        ];

        for (const p of pairs) {
            const el = document.getElementById(p.id) as HTMLInputElement | null;
            if (!el || el.offsetParent === null) continue;

            const value = el.value.replace(/\s+/g, '');
            const valid = isValidPhone(value, { type: p.type });
            determineErrorDisplay(valid, p.id);
            if (!valid) ok = false;
        }

        // Delivery instructions if visible
        const di = document.getElementById('deliveryInfo') as HTMLTextAreaElement | null;
        if (di && di.offsetParent !== null) {
            const valid = validateDeliveryInstructions(di.id, di.value, { required: false, maxLength: 500 });
            if (!valid) ok = false;
        }

        // Safe place Other, if visible
        const other = document.getElementById('other') as HTMLInputElement | null;
        const safeSelect = document.getElementById('safePlaceSelect') as HTMLSelectElement | null;
        if (other && safeSelect && safeSelect.value === 'Z:Other' && other.offsetParent !== null) {
            const hasText = other.value.trim().length > 0;
            determineErrorDisplay(hasText, other.id);
            if (!hasText) ok = false;
        }

        if (!ok) return;

        if (action) action.value = 'yes';
        form?.submit();
    });
}