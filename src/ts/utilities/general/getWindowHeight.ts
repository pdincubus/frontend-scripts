/**
 * Get current browser window height in pixels
 * @return {number} The number of pixels
 */
export function getWindowHeight(): number {
    const windowHeight = Math.max(
        document.documentElement.clientHeight, window.innerHeight || 0
    );

    return windowHeight;
}