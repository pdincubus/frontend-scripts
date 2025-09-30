import { validateDeliveryInstructions } from '~utils/form/validateDeliveryInstructions.js';

export function bindDeliveryInstructions(container: ParentNode = document): void {
    const ta = container.querySelector<HTMLTextAreaElement>('[data-delivery-instructions]');
    if (!ta) return;
    const id = ta.id || 'deliveryInfo';
    const onBlur = () => {
        validateDeliveryInstructions(id, ta.value, { required: false, maxLength: 500 });
    };
    ta.addEventListener('blur', onBlur);
}