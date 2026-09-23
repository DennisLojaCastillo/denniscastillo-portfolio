import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO: udskift med det rigtige domæne inden første rigtige deploy.
// Bruges til sitemap og absolutte URL'er.
export default defineConfig({
  site: 'https://denniscastillo.dk',
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
