import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/ts/**/*.test.ts'],
        exclude: ['public/js/**', 'dist', 'node_modules'],
        reporters: ['default'],
        coverage: {
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: './coverage',
            exclude: [
                'vitest.setup.ts',
                'tests/**',
                '**/*.d.ts',
                'eslint.config.ts',
                'vitest.config.ts',
                'gulpfile.js',
                'src/ts/index.ts',
                'src/ts/utilities/form/validateDeliveryInstructions.ts',
                'eslint.config.ts',
                'src/ts/checkout/delivery.ts',
                'src/ts/checkout/address.ts',
                'src/ts/checkout/credit-card.ts',
                'src/ts/checkout/new-credit.ts'
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 75,
                statements: 80
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/ts'),
            '~checkout': path.resolve(__dirname, 'src/ts/checkout'),
            '~utils': path.resolve(__dirname, 'src/ts/utilities')
        }
    }
});