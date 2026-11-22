import { type CollectionEntry, getCollection } from 'astro:content';
import { getPosts, type Post } from './posts';

export interface Series extends CollectionEntry<'series'> {
  /** Visible parts, ordered by `series.part`. Drafts only appear in dev, like everywhere else. */
  parts: Post[];
}

export interface SeriesContext {
  series: Series;
  index: number;
  prev?: Post;
  next?: Post;
}

/** Every series with at least one visible part, the most recently updated first. */
export async function getSeries(): Promise<Series[]> {
  const [entries, posts] = await Promise.all([getCollection('series'), getPosts()]);
  const all = entries.map((entry) => {
    const parts = posts
      .filter((p) => p.data.series?.id.id === entry.id)
      .sort((a, b) => a.data.series!.part - b.data.series!.part);
    return { ...entry, parts };
  });
  const latest = (s: Series) => Math.max(...s.parts.map((p) => p.data.pubDate.valueOf()));
  return all.filter((s) => s.parts.length > 0).sort((a, b) => latest(b) - latest(a));
}

/** Where a post sits in its series, or undefined for standalone posts. */
export function seriesContext(post: Post, series: Series[]): SeriesContext | undefined {
  const id = post.data.series?.id.id;
  const s = id && series.find((x) => x.id === id);
  if (!s) return undefined;
  const index = s.parts.findIndex((p) => p.id === post.id);
  return { series: s, index, prev: s.parts[index - 1], next: s.parts[index + 1] };
}
