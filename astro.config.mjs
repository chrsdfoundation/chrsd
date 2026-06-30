import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://www.chrsd.org',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    sitemap(),
    react(),
  ],
  image: {
    domains: ['images.unsplash.com', 'media.chrsd.org'],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
