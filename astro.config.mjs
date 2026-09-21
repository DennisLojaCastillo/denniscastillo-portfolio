import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO: udskift med det rigtige domaene inden foerste rigtige deploy.
// Bruges til sitemap og absolutte URL'er.
export default defineConfig({
  site: 'https://denniscastillo.dk',
  integrations: [
    mdx(),
    react(),
    // Designsiderne er midlertidige og hoerer ikke hjemme i sitemap'et.
    sitemap({ filter: (page) => !page.includes('/design') }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
