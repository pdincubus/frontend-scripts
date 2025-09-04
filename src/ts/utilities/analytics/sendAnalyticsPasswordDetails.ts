export function sendAnalyticsPasswordDetails (PWDLength: number, PWDStrength: string): void {
    const event = {
        detail: {
            eventInfo: {
                eventName: "password details",
                eventAction: "password_details",
                type: "custom"
            },
            attributes: {
                PWDLength: PWDLength,
                PWDStrength : PWDStrength
            }
        }
    }

    //const scEvent = document.createEvent('CustomEvent');
    //scEvent.initCustomEvent('launch_custom_event', true, true, event.detail);
    //document.dispatchEvent(scEvent);
}
