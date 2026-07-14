import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://get-quid.site',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({
    filter: (page) => !page.includes('/private-preview/') && !page.includes('/private-kit/'),
    // Keep this fixed to the most recent site-wide content or technical update.
    // A build-time value would falsely tell crawlers that every page changes on every deploy.
    lastmod: new Date('2026-07-15T00:00:00.000Z'),
  })],
  markdown: { shikiConfig: { theme: 'github-light' } },
});
