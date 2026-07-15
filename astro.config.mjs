import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const excludedSitemapPaths = ['/404/', '/404.html', '/private-preview/', '/private-kit/'];

export default defineConfig({
  site: 'https://get-quid.site',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({
    filter: (page) => !excludedSitemapPaths.some((path) => page.includes(path)),
    // Do not set a site-wide lastmod. Google only uses lastmod when it is
    // consistently accurate for each URL; a single deployment date for every
    // page would overstate changes. Add per-page dates with serialize() only
    // when a maintained source of truth exists.
    namespaces: {
      news: false,
      xhtml: false,
      image: false,
      video: false,
    },
  })],
  markdown: { shikiConfig: { theme: 'github-light' } },
});
