import { type CollectionEntry, getCollection } from 'astro:content';

export interface Post extends CollectionEntry<'posts'> {
  readingMinutes: number;
}

const WORDS_PER_MINUTE = 220;

/** Published posts, newest first. Drafts are only visible in dev. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts
    // Same day: series parts in reading order.
    .sort(
      (a, b) =>
        b.data.pubDate.valueOf() - a.data.pubDate.valueOf() ||
        (a.data.series?.part ?? 0) - (b.data.series?.part ?? 0),
    )
    .map((post) => ({
      ...post,
      readingMinutes: Math.max(1, Math.round((post.body ?? '').split(/\s+/).length / WORDS_PER_MINUTE)),
    }));
}

export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);
