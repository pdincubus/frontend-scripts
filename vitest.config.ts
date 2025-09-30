import { defineConfig } from 'vitest/config';

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
                '**/*.d.ts'
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 75,
                statements: 80
            }
        }
    }
});