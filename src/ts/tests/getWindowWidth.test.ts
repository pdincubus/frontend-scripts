import { describe, it, expect, vi } from 'vitest';
import { getWindowWidth } from '../utilities/general/getWindowWidth';

function withSizes(inner: number | undefined, client: number) {
    const innerSpy = vi.spyOn(window, 'innerWidth', 'get')
        .mockReturnValue(inner as unknown as number);
    const clientSpy = vi.spyOn(document.documentElement, 'clientWidth', 'get')
        .mockReturnValue(client);
    return {
        restore() {
            innerSpy.mockRestore();
            clientSpy.mockRestore();
        }
    };
}

describe('getWindowWidth', () => {
    it('returns window.innerWidth when it is larger', () => {
        const m = withSizes(800, 600);

        expect(getWindowWidth()).toBe(800);
        m.restore();
    });

    it('returns documentElement.clientWidth when it is larger', () => {
        const m = withSizes(500, 1200);

        expect(getWindowWidth()).toBe(1200);
        m.restore();
    });

    it('handles window.innerWidth being undefined or 0', () => {
        const m = withSizes(undefined, 400);

        expect(getWindowWidth()).toBe(400);
        m.restore();
    });

    it('falls back to 0 when both values are falsy', () => {
        const m = withSizes(0, 0);

        expect(getWindowWidth()).toBe(0);
        m.restore();
    });
});