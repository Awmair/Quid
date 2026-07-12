import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://get-quid.site',
  output: 'static',
  integrations: [sitemap({
    filter: (page) => !page.includes('/private-preview/'),
  })],
  markdown: { shikiConfig: { theme: 'github-light' } },
});
