import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { comparisons } from '../data/comparisons';

export async function GET(context) {
  const resources = (await getCollection('resources')).sort((a, b) => b.data.updatedDate - a.data.updatedDate);
  return rss({
    title: 'Quid Senior Living Admissions Resources',
    description: 'Practical guidance for senior living admissions teams.',
    site: context.site,
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    items: [
      { title:'Senior Living Software Comparisons: 2026 Buyer’s Hub',description:'Compare senior living CRMs, AI sales platforms and focused inquiry-to-tour automation using current features, positioning and public pricing.',pubDate:new Date('2026-07-12'),link:'/resources/senior-living-software-comparisons/',source:{url:'https://get-quid.site/resources/',title:'Quid Senior Living Admissions Resources'},customData:'<dc:creator>Quid Admissions</dc:creator>' },
      ...comparisons.filter((item)=>item.slug.startsWith('quid-')).map((item)=>({title:`${item.primary}: ${item.h1Type} for 2026`,description:item.description,pubDate:new Date('2026-07-12'),link:`/resources/comparisons/${item.slug}/`,source:{url:'https://get-quid.site/resources/senior-living-software-comparisons/',title:'Quid Senior Living Software Comparisons'},customData:'<dc:creator>Quid Admissions</dc:creator>'})),
      ...resources.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedDate,
      link: `/resources/${entry.id}/`,
      source: { url: 'https://get-quid.site/resources/', title: 'Quid Senior Living Admissions Resources' },
      customData: '<dc:creator>Quid</dc:creator>',
      })),
    ],
  });
}
