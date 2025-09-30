import { describe, it, expect, vi } from 'vitest';
import { getWindowHeight } from '../utilities/general/getWindowHeight';

function withHeights(inner: number | undefined, client: number) {
    const innerSpy = vi.spyOn(window, 'innerHeight', 'get')
        .mockReturnValue(inner as unknown as number);
    const clientSpy = vi.spyOn(document.documentElement, 'clientHeight', 'get')
        .mockReturnValue(client);
    return {
        restore() {
            innerSpy.mockRestore();
            clientSpy.mockRestore();
        }
    };
}

describe('getWindowHeight', () => {
    it('returns window.innerHeight when it is larger', () => {
        const m = withHeights(900, 700);

        expect(getWindowHeight()).toBe(900);
        m.restore();
    });

    it('returns documentElement.clientHeight when it is larger', () => {
        const m = withHeights(500, 1200);

        expect(getWindowHeight()).toBe(1200);
        m.restore();
    });

    it('handles window.innerHeight being undefined or 0', () => {
        const m = withHeights(undefined, 400);

        expect(getWindowHeight()).toBe(400);
        m.restore();
    });

    it('falls back to 0 when both values are 0', () => {
        const m = withHeights(0, 0);

        expect(getWindowHeight()).toBe(0);
        m.restore();
    });
});