import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
    determineErrorDisplay: vi.fn()
}));

import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import { isLDAPPassword } from '../utilities/account/isLDAPPassword';

function mountInputs() {
    const strength = document.createElement('input');
    strength.id = 'passwordStrength';
    const lengthEl = document.createElement('input');
    lengthEl.id = 'passwordLength';
    document.body.append(strength, lengthEl);
    return { strength, lengthEl };
}

beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('isLDAPPassword', () => {
    it('rejects empty string and calls determineErrorDisplay(false)', () => {
        const ok = isLDAPPassword('pwd', '');

        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenCalledTimes(1);
        expect(determineErrorDisplay).toHaveBeenCalledWith(false, 'pwd');
    });

    it('accepts allowed characters and updates strength/length inputs', () => {
        const { strength, lengthEl } = mountInputs();
        const pwd = "Abc123~!#$%^&()_-+={}[]\\|:;'<>,.?/";
        const ok = isLDAPPassword('pwd', pwd);

        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenLastCalledWith(true, 'pwd');
        expect(lengthEl.value).toBe(String(pwd.length));
        expect(strength.value).toBe('hello');
    });

    it('rejects spaces and other disallowed characters and does not update inputs', () => {
        const { strength, lengthEl } = mountInputs();

        strength.value = '';
        lengthEl.value = '';

        const bad = 'No spaces please';
        const ok = isLDAPPassword('pwd', bad);

        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenLastCalledWith(false, 'pwd');
        expect(lengthEl.value).toBe('');
        expect(strength.value).toBe('');
    });

    it('does not throw or update when strength/length inputs are missing', () => {
        const pwd = 'Valid123!';
        const ok = isLDAPPassword('pwd', pwd);

        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenLastCalledWith(true, 'pwd');
        // no inputs present, nothing to assert further
    });

    it('accepts edge characters like backslash and pipe', () => {
        mountInputs();

        const ok = isLDAPPassword('pwd', 'Valid\\|_OK');

        expect(ok).toBe(true);
        expect(determineErrorDisplay).toHaveBeenLastCalledWith(true, 'pwd');
    });

    it('rejects obvious bad punctuation not in the allow-list', () => {
        mountInputs();

        const bad = 'Oops*not-allowed'; // asterisk is not in CHECK_OK
        const ok = isLDAPPassword('pwd', bad);

        expect(ok).toBe(false);
        expect(determineErrorDisplay).toHaveBeenLastCalledWith(false, 'pwd');
    });
});