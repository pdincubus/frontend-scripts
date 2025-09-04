import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        exclude: ['public/js/**', 'dist', 'node_modules'],
    },
    resolve: {
        alias: {
            '@ts': '/src/site/ts',
        },
    },
});