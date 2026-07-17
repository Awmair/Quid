import { readdir, readFile, access } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const root = resolve('dist');
const siteOrigin = 'https://get-quid.site';
const files = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

function outputPathFor(file) {
  return relative(root, file).replaceAll('\\', '/');
}

function routeForOutput(outputPath) {
  if (outputPath === 'index.html') return '/';
  if (outputPath.endsWith('/index.html')) return `/${outputPath.replace(/index\.html$/, '')}`;
  return `/${outputPath}`;
}

function decodeXml(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&apos;', "'");
}

function isAssetPath(pathname) {
  return /\.[a-z0-9]{2,8}$/i.test(pathname);
}

function localUrlTargets(value) {
  let url;
  try { url = new URL(value); } catch { return []; }
  if (url.origin !== siteOrigin) return [];

  const pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') return [join(root, 'index.html')];
  const relativePath = pathname.replace(/^\/+/, '');
  if (isAssetPath(pathname)) return [join(root, relativePath)];
  if (pathname.endsWith('/')) return [join(root, relativePath, 'index.html')];
  return [join(root, relativePath, 'index.html'), join(root, `${relativePath}.html`)];
}

function collectStructuredData(value, file, state, path = 'schema') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStructuredData(item, file, state, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') {
    if (typeof value !== 'string' || !value.startsWith(siteOrigin)) return;
    const url = new URL(value);
    const looksLikePage = url.pathname !== '/' && !url.pathname.endsWith('/') && !isAssetPath(url.pathname);
    if (looksLikePage) state.errors.push(`${file}: structured-data URL is not canonical at ${path}: ${value}`);
    state.localUrls.push({ file, path, value });
    return;
  }

  const object = value;
  const type = object['@type'];
  if (type === 'Organization' && object['@id'] === `${siteOrigin}/#organization`) state.hasOrganization = true;
  if (type === 'WebSite' && object['@id'] === `${siteOrigin}/#website`) {
    state.hasWebsite = true;
    if (object.publisher?.['@id'] !== `${siteOrigin}/#organization`) state.errors.push(`${file}: WebSite schema is not connected to the Organization entity`);
  }
  if (type === 'Article' || (Array.isArray(type) && type.includes('Article'))) {
    state.hasArticle = true;
    if (object.publisher?.['@id'] !== `${siteOrigin}/#organization`) state.errors.push(`${file}: Article publisher must reference ${siteOrigin}/#organization`);
    if (!object.datePublished || !object.dateModified) state.errors.push(`${file}: Article schema is missing datePublished or dateModified`);
  }
  if (type === 'BreadcrumbList' && Array.isArray(object.itemListElement)) {
    object.itemListElement.forEach((entry, index, entries) => {
      if (!entry || typeof entry !== 'object') return;
      if (index < entries.length - 1 && !entry.item) state.errors.push(`${file}: intermediate breadcrumb ${index + 1} is missing an item URL`);
      if (entry.position !== index + 1) state.errors.push(`${file}: breadcrumb positions are not sequential`);
    });
  }

  for (const [key, item] of Object.entries(object)) collectStructuredData(item, file, state, `${path}.${key}`);
}

await walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const errors = [];
const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const indexableCanonicals = new Set();
const canonicalToFile = new Map();
const noindexCanonicals = new Set();
const structuredLocalUrls = [];
const internalInlinks = new Map();
const expectedIndexRobots = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const outputPath = outputPathFor(file);
  const intentionalNoindex = outputPath === '404.html' || outputPath === 'private-preview/index.html' || outputPath === 'private-kit/index.html';
  const expectedCanonical = `${siteOrigin}${routeForOutput(outputPath)}`;

  if (!/<html[^>]*\slang=(?:"en"|'en'|en)(?:\s|>)/i.test(html)) errors.push(`${file}: missing English language declaration`);
  if (!/<meta name="viewport" content="width=device-width, initial-scale=1"/.test(html)) errors.push(`${file}: missing responsive viewport metadata`);

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
  if (canonical) {
    if (canonicalToFile.has(canonical)) errors.push(`${file}: duplicate canonical also used by ${canonicalToFile.get(canonical)}`);
    else canonicalToFile.set(canonical, file);
    canonicals.set(file, canonical);
    if (intentionalNoindex) noindexCanonicals.add(canonical);
    else indexableCanonicals.add(canonical);
  }

  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
  if (h1Count !== 1) errors.push(`${file}: expected exactly one H1, found ${h1Count}`);
  if (!intentionalNoindex && !/<link rel="sitemap" href="\/sitemap-index\.xml"/.test(html)) errors.push(`${file}: missing sitemap discovery link`);
  if (!/<meta property="og:title" content="[^"]+"/.test(html)) errors.push(`${file}: missing Open Graph title`);
  if (!/<meta property="og:description" content="[^"]+"/.test(html)) errors.push(`${file}: missing Open Graph description`);
  if (!/<meta property="og:image" content="https:\/\/get-quid\.site\//.test(html)) errors.push(`${file}: missing absolute Open Graph image`);
  if (!intentionalNoindex && !/<meta property="og:image:alt" content="[^"]+"/.test(html)) errors.push(`${file}: missing Open Graph image alt text`);
  if (!/<meta name="twitter:card" content="summary_large_image"/.test(html)) errors.push(`${file}: missing Twitter card metadata`);
  if (!intentionalNoindex && !/<meta name="twitter:image:alt" content="[^"]+"/.test(html)) errors.push(`${file}: missing Twitter image alt text`);

  const openGraphUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  if (canonical && openGraphUrl !== canonical) errors.push(`${file}: Open Graph URL does not match canonical`);
  if (!canonical && openGraphUrl) errors.push(`${file}: Open Graph URL exists without a canonical URL`);

  for (const imageUrl of [
    html.match(/<meta property="og:image" content="([^"]+)"/)?.[1],
    html.match(/<meta name="twitter:image" content="([^"]+)"/)?.[1],
  ].filter(Boolean)) structuredLocalUrls.push({ file, path: 'social image', value: imageUrl });

  if (/lorem ipsum/i.test(html)) errors.push(`${file}: lorem ipsum found`);
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  const googlebot = html.match(/<meta name="googlebot" content="([^"]+)"/)?.[1];
  if (intentionalNoindex) {
    if (!robots?.includes('noindex')) errors.push(`${file}: intentional noindex page is missing a robots noindex directive`);
    if (googlebot && !googlebot.includes('noindex')) errors.push(`${file}: Googlebot directive conflicts with the intentional noindex`);
  } else {
    if (robots !== expectedIndexRobots) errors.push(`${file}: incomplete robots directive ${robots || '(missing)'}`);
    if (googlebot !== expectedIndexRobots) errors.push(`${file}: incomplete Googlebot directive ${googlebot || '(missing)'}`);
  }

  const schemaState = { errors, localUrls: structuredLocalUrls, hasOrganization: false, hasWebsite: false, hasArticle: false };
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { collectStructuredData(JSON.parse(match[1]), file, schemaState); }
    catch { errors.push(`${file}: invalid JSON-LD`); }
  }
  if (!intentionalNoindex && !schemaState.hasOrganization) errors.push(`${file}: missing canonical Organization entity schema`);
  if (!intentionalNoindex && !schemaState.hasWebsite) errors.push(`${file}: missing canonical WebSite entity schema`);

  const ogType = html.match(/<meta property="og:type" content="([^"]+)"/)?.[1];
  if (schemaState.hasArticle && ogType !== 'article') errors.push(`${file}: Article schema requires og:type=article`);
  if (ogType === 'article') {
    if (!schemaState.hasArticle) errors.push(`${file}: og:type=article requires Article schema`);
    if (!/<meta property="article:published_time" content="[^"]+"/.test(html)) errors.push(`${file}: article published time is missing`);
    if (!/<meta property="article:modified_time" content="[^"]+"/.test(html)) errors.push(`${file}: article modified time is missing`);
  }

  for (const match of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const href = match[1];
    if (/\.(png|jpg|jpeg|webp|avif|gif|svg|ico|xml|css|js|webmanifest|csv|pdf|txt|zip|mp4|webm)$/i.test(href)) continue;
    if (href !== '/' && !href.endsWith('/') && !href.endsWith('.html')) errors.push(`${file}: internal link is not canonical ${href}`);
    if (`${siteOrigin}${href}` !== canonical) internalInlinks.set(href, (internalInlinks.get(href) || 0) + 1);
    const targets = localUrlTargets(`${siteOrigin}${href}`);
    if (!(await Promise.any(targets.map(async (target) => {
      if (await exists(target)) return true;
      throw new Error('missing');
    })).catch(() => false))) errors.push(`${file}: broken internal link ${href}`);
  }
}

if ((internalInlinks.get('/senior-living-inquiry-flow-grader/') || 0) < 5) {
  errors.push('grader page: expected at least five contextual internal inlinks');
}

for (const { file, path, value } of structuredLocalUrls) {
  const targets = localUrlTargets(value);
  if (!targets.length) continue;
  const found = await Promise.any(targets.map(async (target) => {
    if (await exists(target)) return true;
    throw new Error('missing');
  })).catch(() => false);
  if (!found) errors.push(`${file}: local URL does not resolve at ${path}: ${value}`);
}

for (const required of [
  'CNAME',
  'robots.txt',
  'rss.xml',
  '404.html',
  'sitemap-index.xml',
  'sitemap-0.xml',
  'llms.txt',
  'llms-full.txt',
  'data/senior-living-inquiry-to-tour-audit-2026.csv',
  'data/senior-living-inquiry-to-tour-benchmark-sources-2026.csv',
  'downloads/quid-senior-living-inquiry-to-tour-benchmark-2026.pdf',
  'downloads/quid-benchmark-2026-media-brief.txt',
  'research/benchmark-2026-cohort-comparison.svg',
  'research/benchmark-2026-visible-signals.svg',
]) {
  if (!(await exists(join(root, required)))) errors.push(`dist/${required}: missing`);
}

const requiredPages = [
  'index.html',
  'solutions/index.html',
  'see-quid-in-action/index.html',
  'how-it-works/index.html',
  'human-handoffs/index.html',
  'pilot/index.html',
  'meet-quid/index.html',
  'about/index.html',
  'assisted-living-admissions-automation/index.html',
  'senior-living-inquiry-follow-up-automation/index.html',
  'senior-living-tour-scheduling-software/index.html',
  'senior-living-inquiry-flow-grader/index.html',
  'resources/index.html',
  'resources/senior-living-software-comparisons/index.html',
  'resources/senior-living-admissions-automation-software/index.html',
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
  'resources/comparisons/quid-vs-aline/index.html',
  'resources/comparisons/quid-vs-further/index.html',
  'resources/comparisons/quid-vs-ecp/index.html',
  'resources/comparisons/quid-vs-welcomehome/index.html',
  'resources/comparisons/quid-vs-advantage-anywhere/index.html',
  'privacy/index.html',
  'terms/index.html',
];
for (const required of requiredPages) {
  if (!(await exists(join(root, required)))) errors.push(`dist/${required}: required page missing`);
}

try {
  const cname = (await readFile(join(root, 'CNAME'), 'utf8')).trim();
  if (cname !== 'get-quid.site') errors.push(`dist/CNAME: expected get-quid.site, found ${cname || '(empty)'}`);
} catch {}

try {
  const robots = await readFile(join(root, 'robots.txt'), 'utf8');
  if (!/User-agent:\s*\*/i.test(robots) || !/Allow:\s*\//i.test(robots)) errors.push('dist/robots.txt: crawler allow rules missing');
  if (!/Sitemap:\s*https:\/\/get-quid\.site\/sitemap-index\.xml/i.test(robots)) errors.push('dist/robots.txt: sitemap index missing');
  if (/Disallow:\s*\//i.test(robots)) errors.push('dist/robots.txt: site-wide crawler block found');
} catch {}

try {
  const sitemap = await readFile(join(root, 'sitemap-0.xml'), 'utf8');
  const blocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  const sitemapUrls = blocks.map((block) => decodeXml(block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim() || '')).filter(Boolean);
  const sitemapSet = new Set(sitemapUrls);

  if (sitemapUrls.length !== sitemapSet.size) errors.push('dist/sitemap-0.xml: duplicate URL entries found');
  for (const url of sitemapUrls) {
    if (!url.startsWith(`${siteOrigin}/`)) errors.push(`dist/sitemap-0.xml: non-production URL found ${url}`);
    const parsed = new URL(url);
    if (parsed.pathname !== '/' && !parsed.pathname.endsWith('/')) errors.push(`dist/sitemap-0.xml: non-canonical URL found ${url}`);
    if (noindexCanonicals.has(url)) errors.push(`dist/sitemap-0.xml: noindex URL included ${url}`);
  }
  for (const canonical of indexableCanonicals) {
    if (!sitemapSet.has(canonical)) errors.push(`dist/sitemap-0.xml: canonical URL missing ${canonical}`);
  }
  for (const url of sitemapSet) {
    if (!indexableCanonicals.has(url)) errors.push(`dist/sitemap-0.xml: orphan URL without an indexable canonical ${url}`);
  }
  if (sitemapUrls.length !== indexableCanonicals.size) errors.push(`dist/sitemap-0.xml: expected ${indexableCanonicals.size} canonical URLs, found ${sitemapUrls.length}`);
  if (sitemap.includes('/404')) errors.push('dist/sitemap-0.xml: 404 page should be excluded');
  if (sitemap.includes('/private-preview')) errors.push('dist/sitemap-0.xml: private preview should be excluded');
  if (sitemap.includes('/private-kit')) errors.push('dist/sitemap-0.xml: private kit should be excluded');

  const lastmods = blocks.map((block) => block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]?.trim()).filter(Boolean);
  for (const lastmod of lastmods) {
    const timestamp = Date.parse(lastmod);
    if (Number.isNaN(timestamp)) errors.push(`dist/sitemap-0.xml: invalid lastmod ${lastmod}`);
    if (timestamp > Date.now() + 86_400_000) errors.push(`dist/sitemap-0.xml: future lastmod ${lastmod}`);
  }
  if (blocks.length > 1 && lastmods.length === blocks.length && new Set(lastmods).size === 1) {
    errors.push('dist/sitemap-0.xml: every URL has the same lastmod; use maintained per-page dates or omit lastmod');
  }
} catch {}

try {
  const sitemapIndex = await readFile(join(root, 'sitemap-index.xml'), 'utf8');
  if (!sitemapIndex.includes(`<loc>${siteOrigin}/sitemap-0.xml</loc>`)) errors.push('dist/sitemap-index.xml: production sitemap URL missing');
} catch {}

try {
  const rss = await readFile(join(root, 'rss.xml'), 'utf8');
  if (!rss.includes('<title>Quid Senior Living Admissions Resources</title>')) errors.push('dist/rss.xml: expected channel title missing');
  for (const match of rss.matchAll(/<link>(https:\/\/get-quid\.site[^<]+)<\/link>/g)) {
    const url = decodeXml(match[1]);
    const parsed = new URL(url);
    if (parsed.pathname !== '/' && !parsed.pathname.endsWith('/') && !isAssetPath(parsed.pathname)) errors.push(`dist/rss.xml: non-canonical local link ${url}`);
  }
} catch {}

try {
  const benchmark = await readFile(join(root, 'resources/senior-living-inquiry-to-tour-audit/index.html'), 'utf8');
  for (const expected of [
    'community pages reviewed',
    '/downloads/quid-senior-living-inquiry-to-tour-benchmark-2026.pdf',
    '/data/senior-living-inquiry-to-tour-benchmark-sources-2026.csv',
    '/research/benchmark-2026-cohort-comparison.svg',
    '/research/benchmark-2026-visible-signals.svg',
  ]) {
    if (!benchmark.includes(expected)) errors.push(`benchmark page: missing ${expected}`);
  }
} catch {}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Search Console QA passed for ${htmlFiles.length} HTML files: canonical parity, index directives, structured data, local schema URLs, crawl files, social metadata, sitemap coverage, RSS, and internal links.`);
