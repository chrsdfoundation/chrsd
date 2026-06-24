import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../../../data/navigation';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: 'CHRSD Blog',
    description: 'Field notes, research, and stories from CHRSD.',
    site: context.site ?? site.url,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/stay-informed/blog/${post.slug}/`,
      })),
  });
}
