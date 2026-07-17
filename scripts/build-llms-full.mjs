import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const siteOrigin = 'https://get-quid.site';

async function walk(directory, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path, files);
    else files.push(path);
  }
  return files;
}

function decodeHtml(value) {
  const named = {
    amp: '&', apos: "'", gt: '>', lt: '<', nbsp: ' ', quot: '"',
  };
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&([a-z]+);/gi, (entity, name) => named[name.toLowerCase()] ?? entity);
}

function plainText(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function routeForFile(file, outputDirectory) {
  const outputPath = relative(outputDirectory, file).replaceAll('\\', '/');
  if (outputPath === 'index.html') return '/';
  if (outputPath.endsWith('/index.html')) return `/${outputPath.replace(/index\.html$/, '')}`;
  return `/${outputPath}`;
}

function tableToMarkdown(tableHtml) {
  const rows = [...tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((row) => [...row[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)]
      .map((cell) => plainText(cell[1]).replaceAll('|', '\\|')))
    .filter((row) => row.length > 0);
  if (!rows.length) return '';

  const width = Math.max(...rows.map((row) => row.length));
  const normalized = rows.map((row) => [...row, ...Array(width - row.length).fill('')]);
  return `\n\n| ${normalized[0].join(' | ')} |\n| ${Array(width).fill('---').join(' | ')} |\n${normalized
    .slice(1)
    .map((row) => `| ${row.join(' | ')} |`)
    .join('\n')}\n\n`;
}

function htmlToMarkdown(mainHtml, canonicalUrl) {
  let markdown = mainHtml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|noscript|template|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (_, table) => tableToMarkdown(table))
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<(input|textarea|select)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(input|textarea|select)\b[^>]*\/?>/gi, '')
    .replace(/<a\b[^>]*href=(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi, (_, doubleHref, singleHref, labelHtml) => {
      const label = plainText(labelHtml);
      const href = doubleHref || singleHref;
      if (!label || !href) return label;
      let absoluteHref = href;
      try { absoluteHref = new URL(href, canonicalUrl).toString(); } catch { /* Keep the rendered href. */ }
      return ` [${label}](${absoluteHref}) `;
    })
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, content) => {
      const shiftedLevel = Math.min(Number(level) + 1, 6);
      return `\n\n${'#'.repeat(shiftedLevel)} ${plainText(content)}\n\n`;
    })
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, content) => `**${plainText(content)}**`)
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, content) => `*${plainText(content)}*`)
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, content) => `\n- ${plainText(content)}`)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|section|article|aside|blockquote|figure|figcaption|ul|ol|dl|dd|dt|form)>/gi, '\n\n')
    .replace(/<(p|div|section|article|aside|blockquote|figure|figcaption|ul|ol|dl|dd|dt|form)\b[^>]*>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ');

  markdown = decodeHtml(markdown)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return markdown;
}

export async function generateLlmsFull(outputDirectory = resolve('dist')) {
  const htmlFiles = (await walk(outputDirectory)).filter((file) => file.endsWith('.html'));
  const pages = [];

  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || '';
    const expectedCanonical = new URL(routeForFile(file, outputDirectory), siteOrigin).toString();
    if (!canonical || canonical !== expectedCanonical || robots.toLowerCase().includes('noindex')) continue;

    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
    if (!main) throw new Error(`${file}: canonical page is missing a main element`);

    const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || canonical);
    const description = decodeHtml(html.match(/<meta name="description" content="([^"]*)"/)?.[1] || '');
    const content = htmlToMarkdown(main, canonical);
    if (!content) throw new Error(`${file}: canonical page produced no Markdown content`);

    pages.push({ canonical, title, description, content });
  }

  pages.sort((left, right) => {
    if (left.canonical === `${siteOrigin}/`) return -1;
    if (right.canonical === `${siteOrigin}/`) return 1;
    return left.canonical.localeCompare(right.canonical);
  });

  const sections = pages.map(({ canonical, title, description, content }) => [
    '---',
    '',
    `Canonical URL: ${canonical}`,
    `HTML title: ${title}`,
    `Meta description: ${description}`,
    '',
    content,
  ].join('\n'));

  const document = [
    '# Quid: Full canonical website content',
    '',
    '> Generated automatically from the rendered content of every self-canonical, indexable Quid page. Private and noindex pages are excluded.',
    '',
    `Site: ${siteOrigin}/`,
    `Canonical pages included: ${pages.length}`,
    '',
    ...sections,
    '',
  ].join('\n');

  const outputPath = join(outputDirectory, 'llms-full.txt');
  await writeFile(outputPath, document, 'utf8');
  return { outputPath, pageCount: pages.length, bytes: Buffer.byteLength(document) };
}

const invokedFile = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === invokedFile) {
  const outputDirectory = process.argv[2] ? resolve(process.argv[2]) : resolve('dist');
  const result = await generateLlmsFull(outputDirectory);
  console.log(`Generated ${relative(dirname(result.outputPath), result.outputPath)} from ${result.pageCount} canonical pages (${result.bytes} bytes).`);
}
