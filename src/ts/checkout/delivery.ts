import { bindSafePlace } from './delivery/safePlace.js';
import { bindContactNumbers } from './delivery/contactNumbers.js';
import { bindDeliveryInstructions } from './delivery/instructions.js';
import { bindParcelshopSelected } from './delivery/parcelshopEvents.js';
import { bindApplyButton } from './delivery/formSubmit.js';

export function initDeliveryPage(root: ParentNode = document): void {
    bindSafePlace(root);
    bindContactNumbers(root);
    bindDeliveryInstructions(root);
    bindParcelshopSelected();
    bindApplyButton(root);
}

initDeliveryPage();