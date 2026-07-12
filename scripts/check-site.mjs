import { readdir, readFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve('dist');
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const errors = [];
const titles = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!title) errors.push(`${file}: missing title`);
  else if (titles.has(title)) errors.push(`${file}: duplicate title also used by ${titles.get(title)}`);
  else titles.set(title, file);
  if (!description) errors.push(`${file}: missing meta description`);
  else if (descriptions.has(description)) errors.push(`${file}: duplicate meta description also used by ${descriptions.get(description)}`);
  else descriptions.set(description, file);
  if (!/<link rel="canonical" href="https:\/\/get-quid\.site\//.test(html)) errors.push(`${file}: missing canonical`);
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
  if (h1Count !== 1) errors.push(`${file}: expected exactly one H1, found ${h1Count}`);
  if (!/<meta property="og:title" content="[^"]+"/.test(html)) errors.push(`${file}: missing Open Graph title`);
  if (!/<meta property="og:description" content="[^"]+"/.test(html)) errors.push(`${file}: missing Open Graph description`);
  if (!/<meta property="og:image" content="https:\/\/get-quid\.site\//.test(html)) errors.push(`${file}: missing absolute Open Graph image`);
  if (!/<meta name="twitter:card" content="summary_large_image"/.test(html)) errors.push(`${file}: missing Twitter card metadata`);
  if (/lorem ipsum/i.test(html)) errors.push(`${file}: lorem ipsum found`);
  const intentionalNoindex = file.endsWith('404.html') || file.endsWith('private-preview/index.html');
  if (!intentionalNoindex && /<meta name="robots" content="[^"]*noindex/i.test(html)) errors.push(`${file}: unexpected noindex`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${file}: invalid JSON-LD`); }
  }
  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = match[1];
    if (/\.(png|jpg|jpeg|webp|svg|ico|xml|css|js|webmanifest)$/.test(href)) continue;
    const target = href === '/' ? join(root, 'index.html') : join(root, href.replace(/^\//, ''), 'index.html');
    const fallback = join(root, `${href.replace(/^\//, '').replace(/\/$/, '')}.html`);
    try { await access(target); } catch { try { await access(fallback); } catch { errors.push(`${file}: broken internal link ${href}`); } }
  }
}

for (const required of ['CNAME', 'robots.txt', 'rss.xml', '404.html', 'sitemap-index.xml', 'sitemap-0.xml', 'llms.txt', 'llms-full.txt']) {
  try { await access(join(root, required)); } catch { errors.push(`dist/${required}: missing`); }
}

const requiredPages = [
  'index.html',
  'see-quid-in-action/index.html',
  'how-it-works/index.html',
  'human-handoffs/index.html',
  'pilot/index.html',
  'meet-quid/index.html',
  'assisted-living-admissions-automation/index.html',
  'senior-living-inquiry-follow-up-automation/index.html',
  'resources/index.html',
  'resources/senior-living-admissions-automation/index.html',
  'resources/senior-living-inquiry-response-time/index.html',
  'resources/senior-living-tour-follow-up/index.html',
  'resources/senior-living-daily-admissions-summary/index.html',
  'resources/senior-living-human-handoff-checklist/index.html',
  'resources/senior-living-follow-up-templates/index.html',
  'privacy/index.html',
  'terms/index.html',
];
for (const required of requiredPages) {
  try { await access(join(root, required)); } catch { errors.push(`dist/${required}: required page missing`); }
}

try {
  const robots = await readFile(join(root, 'robots.txt'), 'utf8');
  if (!/User-agent:\s*\*/i.test(robots) || !/Allow:\s*\//i.test(robots)) errors.push('dist/robots.txt: crawler allow rules missing');
  if (!/Sitemap:\s*https:\/\/get-quid\.site\/sitemap-index\.xml/i.test(robots)) errors.push('dist/robots.txt: sitemap index missing');
  if (/Disallow:\s*\//i.test(robots)) errors.push('dist/robots.txt: site-wide crawler block found');
} catch {}

try {
  const sitemap = await readFile(join(root, 'sitemap-0.xml'), 'utf8');
  for (const page of requiredPages.filter((page) => page !== 'index.html')) {
    const route = page.replace(/index\.html$/, '');
    if (!sitemap.includes(`https://get-quid.site/${route}`)) errors.push(`dist/sitemap-0.xml: missing /${route}`);
  }
  if (sitemap.includes('/404')) errors.push('dist/sitemap-0.xml: 404 page should be excluded');
  if (sitemap.includes('/private-preview')) errors.push('dist/sitemap-0.xml: private preview should be excluded');
} catch {}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`SEO QA passed for ${htmlFiles.length} HTML files: H1s, metadata, JSON-LD, crawl files, sitemap coverage, and internal links.`);
