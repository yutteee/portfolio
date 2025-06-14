import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from "astro-icon";
import sitemap from '@astrojs/sitemap';

import react from "@astrojs/react";

export default defineConfig({
  site: 'https://yutteee.pages.dev',
  integrations: [mdx(), sitemap(), icon(), react()],
  vite: { optimizeDeps: { exclude: ['@resvg/resvg-js'] } }
});