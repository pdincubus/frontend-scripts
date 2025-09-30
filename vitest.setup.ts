// Add any globals, spies, or polyfills you need here.
// Example: silencing noisy logs during tests.
const originalError = console.error;

console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Deprecated')) return;
    originalError(...args);
};