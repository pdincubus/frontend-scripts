import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../utilities/general/debounce';

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('calls once with the latest arguments after the wait', () => {
        const spy = vi.fn();
        const debounced = debounce(spy, 50);

        debounced('a');
        vi.advanceTimersByTime(25);
        debounced('b');
        vi.advanceTimersByTime(25);
        debounced('c');

        // still waiting
        expect(spy).toHaveBeenCalledTimes(0);

        // fire final scheduled call
        vi.advanceTimersByTime(50);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenLastCalledWith('c');
    });

    it('restarts the timer on rapid calls and respects the full delay', () => {
        const spy = vi.fn();
        const debounced = debounce(spy, 100);

        debounced(1);
        vi.advanceTimersByTime(90);
        debounced(2);
        // not enough time since the last call
        vi.advanceTimersByTime(90);
        expect(spy).toHaveBeenCalledTimes(0);

        vi.advanceTimersByTime(10);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenLastCalledWith(2);
    });

    it('handles multiple independent debounced functions', () => {
        const a = vi.fn();
        const b = vi.fn();
        const debouncedA = debounce(a, 30);
        const debouncedB = debounce(b, 30);

        debouncedA('x');
        debouncedB('y');

        vi.advanceTimersByTime(30);

        expect(a).toHaveBeenCalledTimes(1);
        expect(a).toHaveBeenLastCalledWith('x');
        expect(b).toHaveBeenCalledTimes(1);
        expect(b).toHaveBeenLastCalledWith('y');
    });

    it('supports zero wait by scheduling on the next tick', () => {
        const spy = vi.fn();
        const debounced = debounce(spy, 0);

        debounced('z');
        expect(spy).toHaveBeenCalledTimes(0);

        vi.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenLastCalledWith('z');
    });
});