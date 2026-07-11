import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const resources = (await getCollection('resources')).sort((a, b) => b.data.updatedDate - a.data.updatedDate);
  return rss({
    title: 'Quid Senior Living Admissions Resources',
    description: 'Practical guidance for senior living admissions teams.',
    site: context.site,
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    items: resources.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedDate,
      link: `/resources/${entry.id}`,
      source: { url: 'https://get-quid.site/resources', title: 'Quid Senior Living Admissions Resources' },
      customData: '<dc:creator>Quid</dc:creator>',
    })),
  });
}
