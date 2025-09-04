/**
 * Debounce function stolen from here:
* https://www.freecodecamp.org/news/javascript-debounce-example/
 */
export function debounce<Args extends unknown[]>(
    func: (...args: Args) => void,
    wait: number
): (...args: Args) => void {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: Args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}