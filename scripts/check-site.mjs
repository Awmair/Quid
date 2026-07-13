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
const indexableCanonicals = [];

function checkStructuredDataUrls(value, file, path = 'schema') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkStructuredDataUrls(item, file, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) checkStructuredDataUrls(item, file, `${path}.${key}`);
    return;
  }
  if (typeof value !== 'string' || !value.startsWith('https://get-quid.site')) return;
  const url = new URL(value);
  const looksLikePage = url.pathname !== '/' && !url.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(url.pathname);
  if (looksLikePage) errors.push(`${file}: structured-data URL is not canonical at ${path}: ${value}`);
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const outputPath = file.slice(root.length + 1).replaceAll('\\', '/');
  const intentionalNoindex = outputPath === '404.html' || outputPath === 'private-preview/index.html' || outputPath === 'private-kit/index.html';
  const route = outputPath === 'index.html'
    ? '/'
    : outputPath.endsWith('/index.html')
      ? `/${outputPath.replace(/index\.html$/, '')}`
      : `/${outputPath}`;
  const expectedCanonical = `https://get-quid.site${route}`;
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!title) errors.push(`${file}: missing title`);
  else if (titles.has(title)) errors.push(`${file}: duplicate title also used by ${titles.get(title)}`);
  else titles.set(title, file);
  if (!description) errors.push(`${file}: missing meta description`);
  else if (descriptions.has(description)) errors.push(`${file}: duplicate meta description also used by ${descriptions.get(description)}`);
  else descriptions.set(description, file);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical && outputPath !== '404.html') errors.push(`${file}: missing canonical`);
  if (canonical && canonical !== expectedCanonical) errors.push(`${file}: canonical ${canonical} does not match served URL ${expectedCanonical}`);
  if (canonical && !intentionalNoindex) indexableCanonicals.push(canonical);
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
  if (h1Count !== 1) errors.push(`${file}: expected exactly one H1, found ${h1Count}`);
  if (!/<meta property="og:title" content="[^"]+"/.test(html)) errors.push(`${file}: missing Open Graph title`);
  if (!/<meta property="og:description" content="[^"]+"/.test(html)) errors.push(`${file}: missing Open Graph description`);
  const openGraphUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  if (canonical && openGraphUrl !== canonical) errors.push(`${file}: Open Graph URL does not match canonical`);
  if (!canonical && openGraphUrl) errors.push(`${file}: Open Graph URL exists without a canonical URL`);
  if (!/<meta property="og:image" content="https:\/\/get-quid\.site\//.test(html)) errors.push(`${file}: missing absolute Open Graph image`);
  if (!/<meta name="twitter:card" content="summary_large_image"/.test(html)) errors.push(`${file}: missing Twitter card metadata`);
  if (/lorem ipsum/i.test(html)) errors.push(`${file}: lorem ipsum found`);
  if (!intentionalNoindex && /<meta name="robots" content="[^"]*noindex/i.test(html)) errors.push(`${file}: unexpected noindex`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { checkStructuredDataUrls(JSON.parse(match[1]), file); } catch { errors.push(`${file}: invalid JSON-LD`); }
  }
  for (const match of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const href = match[1];
    if (/\.(png|jpg|jpeg|webp|svg|ico|xml|css|js|webmanifest|csv)$/.test(href)) continue;
    if (href !== '/' && !href.endsWith('/') && !href.endsWith('.html')) errors.push(`${file}: internal link is not canonical ${href}`);
    const target = href === '/' ? join(root, 'index.html') : join(root, href.replace(/^\//, ''), 'index.html');
    const fallback = join(root, `${href.replace(/^\//, '').replace(/\/$/, '')}.html`);
    try { await access(target); } catch { try { await access(fallback); } catch { errors.push(`${file}: broken internal link ${href}`); } }
  }
}

for (const required of ['CNAME', 'robots.txt', 'rss.xml', '404.html', 'sitemap-index.xml', 'sitemap-0.xml', 'llms.txt', 'llms-full.txt', 'data/senior-living-inquiry-to-tour-audit-2026.csv']) {
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
  'senior-living-tour-scheduling-software/index.html',
  'senior-living-inquiry-flow-grader/index.html',
  'resources/index.html',
  'resources/how-to-increase-assisted-living-occupancy/index.html',
  'resources/senior-living-admissions-automation/index.html',
  'resources/senior-living-inquiry-to-tour-audit/index.html',
  'resources/senior-living-inquiry-response-time/index.html',
  'resources/senior-living-tour-follow-up/index.html',
  'resources/senior-living-daily-admissions-summary/index.html',
  'resources/senior-living-human-handoff-checklist/index.html',
  'resources/senior-living-follow-up-templates/index.html',
  'resources/alternatives/aline-alternatives/index.html',
  'resources/alternatives/further-alternatives/index.html',
  'resources/alternatives/ecp-crm-alternatives/index.html',
  'resources/alternatives/welcomehome-alternatives/index.html',
  'resources/alternatives/advantage-anywhere-alternatives/index.html',
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
  if (sitemap.includes('/private-kit')) errors.push('dist/sitemap-0.xml: private kit should be excluded');
  for (const canonical of indexableCanonicals) {
    if (!sitemap.includes(`<loc>${canonical}</loc>`)) errors.push(`dist/sitemap-0.xml: canonical URL missing ${canonical}`);
  }
} catch {}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`SEO QA passed for ${htmlFiles.length} HTML files: H1s, metadata, JSON-LD, crawl files, sitemap coverage, and internal links.`);
