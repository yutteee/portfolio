import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ["src/**/*.test.tsx"],
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],
    globals: true,
  },
}); 