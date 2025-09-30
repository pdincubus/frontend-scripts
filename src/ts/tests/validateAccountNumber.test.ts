import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock exactly how the SUT imports it
vi.mock('../utilities/form/determineErrorDisplay.js', () => ({
  determineErrorDisplay: vi.fn()
}));

import { determineErrorDisplay } from '../utilities/form/determineErrorDisplay.js';
import {
  validateAccountNumberValue,
  validateAccountNumber
} from '../utilities/form/validateAccountNumber';

function makeInput(value: string): HTMLInputElement {
  const el = document.createElement('input');
  el.value = value;
  return el;
}

beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

describe('validateAccountNumberValue (pure)', () => {
  it('passes with default rules when non empty', () => {
    const r = validateAccountNumberValue('123456');
    expect(r.ok).toBe(true);
  });

  it('fails when required and empty', () => {
    const r = validateAccountNumberValue('', { required: true });
    expect(r.ok).toBe(false);
    expect(r.message).toBe('Account number is required.');
  });

  it('passes when not required and empty', () => {
    const r = validateAccountNumberValue('', { required: false });
    expect(r.ok).toBe(true);
  });

  it('applies minLength and maxLength', () => {
    expect(validateAccountNumberValue('12345', { minLength: 6 }).ok).toBe(false);
    expect(validateAccountNumberValue('123456', { minLength: 6 }).ok).toBe(true);
    expect(validateAccountNumberValue('1234567890123', { maxLength: 12 }).ok).toBe(false);
  });

  it('applies a format pattern, e.g. digits only', () => {
    const opts = { pattern: /^\d+$/ };
    expect(validateAccountNumberValue('ABC123', opts).ok).toBe(false);
    expect(validateAccountNumberValue('001234', opts).ok).toBe(true);
  });
});

describe('validateAccountNumber (wrapper)', () => {
  const fieldId = 'accountNumber';

  it('pipes result to determineErrorDisplay and returns boolean', () => {
    const input = makeInput('123456');
    const ok = validateAccountNumber(fieldId, input, { minLength: 6, pattern: /^\d+$/ });
    expect(ok).toBe(true);
    expect(determineErrorDisplay).toHaveBeenCalledWith(true, fieldId);
  });

  it('reports false on failure', () => {
    const input = makeInput('');
    const ok = validateAccountNumber(fieldId, input, { required: true });
    expect(ok).toBe(false);
    expect(determineErrorDisplay).toHaveBeenCalledWith(false, fieldId);
  });
});