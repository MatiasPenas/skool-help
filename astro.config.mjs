// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import rehypeExternalLinks from 'rehype-external-links';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://skool.help',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [
    react(),
    tailwind(),
    mdx(),
    sitemap(),
  ],
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
});
