import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/core/**', 'src/lib/**'],
      exclude: [
        'src/demo/**',
        '**/*.d.ts',
        '**/node_modules/**',
        '**/index.ts', // Re-exports only
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/setup.ts', 'tests/helpers/**'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tests': resolve(__dirname, './tests'),
    },
  },
});
