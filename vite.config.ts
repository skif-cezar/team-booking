import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
    exclude: ['node_modules', 'dist'],
  },
});
