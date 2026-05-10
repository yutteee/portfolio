import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    storybookTest({ configDir: path.join(dirname, '.storybook') }),
  ],
  // ブラウザモード初回起動時、走行中に Vite が新規依存を検出して再最適化＆再ロードが走ると、
  // 最適化前後の React が二重ロードされ `useRef` 等が null になる。
  // 起動前に prebundle を確定させることでコールドスタート時のレースを防ぐ。
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-icons/fi',
    ],
  },
  test: {
    include: ["src/**/*.test.tsx"],
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }]
    },
    setupFiles: ['.storybook/vitest.setup.ts'],
  },
}); 