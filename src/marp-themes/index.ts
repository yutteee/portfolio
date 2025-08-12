import customTheme from './custom-theme.css?raw';

export const marpThemes = {
  'custom-theme': customTheme,
  'default': undefined, // デフォルトテーマを使用
} as const;

export type MarpTheme = keyof typeof marpThemes; 