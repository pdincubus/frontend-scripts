export const ANALYTICS_EVENT = 'launch_custom_event';

type PasswordAnalyticsDetail = {
    eventInfo: {
        eventName: 'password details';
        eventAction: 'password_details';
        type: 'custom';
    };
    attributes: {
        PWDLength: number;
        PWDStrength: string;
    };
};

export function sendAnalyticsPasswordDetails(PWDLength: number, PWDStrength: string): void {
    // be defensive, keep payload sane
    const length = Number.isFinite(PWDLength) ? Math.max(0, Math.floor(PWDLength)) : 0;
    const strength = String(PWDStrength);

    const detail: PasswordAnalyticsDetail = {
        eventInfo: {
            eventName: 'password details',
            eventAction: 'password_details',
            type: 'custom'
        },
        attributes: {
            PWDLength: length,
            PWDStrength: strength
        }
    };

    const ev = new CustomEvent(ANALYTICS_EVENT, {
        bubbles: true,
        cancelable: true,
        detail
    });

    document.dispatchEvent(ev);
}