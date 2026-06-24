import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.chrsd.org',
  integrations: [sitemap()],
  image: {
    // Allow remote demo imagery; replace/remove for production CDN setup.
    domains: ['images.unsplash.com'],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
