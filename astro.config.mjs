import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from "astro-icon";
import sitemap from '@astrojs/sitemap';

import react from "@astrojs/react";

export default defineConfig({
  site: 'https://yutteee.pages.dev',
  integrations: [
    mdx(),
    sitemap({
      // /sitemap/ は Footer から辿るユーザー向けの一覧ページのため、
      // 検索エンジン向けの sitemap.xml からは除外する
      filter: (page) => !page.includes('/sitemap'),
      // ポートフォリオなのでページ単位で差を付けず全体一律のヒントを付与
      changefreq: 'weekly',
      priority: 0.7,
    }),
    icon(),
    react(),
  ],
  vite: { optimizeDeps: { exclude: ['@resvg/resvg-js'] } }
});