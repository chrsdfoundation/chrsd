import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://www.chrsd.org',
  output: 'server',
  adapter: netlify(),
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
