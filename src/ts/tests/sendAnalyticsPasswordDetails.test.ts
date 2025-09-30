import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ANALYTICS_EVENT, sendAnalyticsPasswordDetails } from '../utilities/analytics/sendAnalyticsPasswordDetails';

beforeEach(() => {
    vi.restoreAllMocks();
});

describe('sendAnalyticsPasswordDetails', () => {
    it('dispatches a CustomEvent with the correct name and detail', () => {
        const handler = vi.fn((e: Event) => {
            const ev = e as CustomEvent;

            expect(ev.type).toBe(ANALYTICS_EVENT);
            expect(ev.bubbles).toBe(true);
            expect(ev.cancelable).toBe(true);

            // payload shape
            expect(ev.detail.eventInfo).toEqual({
                eventName: 'password details',
                eventAction: 'password_details',
                type: 'custom'
            });

            expect(ev.detail.attributes).toEqual({
                PWDLength: 12,
                PWDStrength: 'Good'
            });
        });

        document.addEventListener(ANALYTICS_EVENT, handler);

        sendAnalyticsPasswordDetails(12, 'Good');

        expect(handler).toHaveBeenCalledTimes(1);

        document.removeEventListener(ANALYTICS_EVENT, handler);
    });

    it('coerces length to a non-negative integer and strength to string', () => {
        const seen: any[] = [];
        const handler = (e: Event) => {
            const ev = e as CustomEvent;
            seen.push(ev.detail.attributes);
        };

        document.addEventListener(ANALYTICS_EVENT, handler);

        sendAnalyticsPasswordDetails(12.7 as unknown as number, 'Strong');
        sendAnalyticsPasswordDetails(NaN, 123 as unknown as string);

        document.removeEventListener(ANALYTICS_EVENT, handler);

        expect(seen[0]).toEqual({ PWDLength: 12, PWDStrength: 'Strong' });
        expect(seen[1]).toEqual({ PWDLength: 0, PWDStrength: '123' });
    });

    it('bubbles so listeners on window can see it', () => {
        const winHandler = vi.fn();

        window.addEventListener(ANALYTICS_EVENT, winHandler);

        sendAnalyticsPasswordDetails(8, 'Weak');

        expect(winHandler).toHaveBeenCalledTimes(1);

        window.removeEventListener(ANALYTICS_EVENT, winHandler);
    });
});