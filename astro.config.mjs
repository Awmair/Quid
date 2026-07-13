import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://get-quid.site',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({
    filter: (page) => !page.includes('/private-preview/') && !page.includes('/private-kit/'),
  })],
  markdown: { shikiConfig: { theme: 'github-light' } },
});
