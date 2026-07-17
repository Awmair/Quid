import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import { generateLlmsFull } from './scripts/build-llms-full.mjs';

const excludedSitemapPaths = ['/404/', '/404.html', '/private-preview/', '/private-kit/'];

const llmsFullIntegration = {
  name: 'quid-llms-full',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const result = await generateLlmsFull(fileURLToPath(dir));
      console.log(`Generated llms-full.txt from ${result.pageCount} canonical pages.`);
    },
  },
};

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
  }), llmsFullIntegration],
  markdown: { shikiConfig: { theme: 'github-light' } },
});
