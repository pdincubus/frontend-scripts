/**
 * Get current browser window width in pixels
 * @return {number} The number of pixels
 */
export function getWindowWidth(): number {
    const windowWidth = Math.max(
        document.documentElement.clientWidth, window.innerWidth || 0
    );

    return windowWidth;
}