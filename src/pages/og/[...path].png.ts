// Link-preview images, one per post and series plus a default: /og/posts/<id>.png, /og/series/<id>.png,
// /og/default.png. Static files generated at build time.
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOgImage, type OgCard } from '@/lib/og';
import { getPosts, isoDate } from '@/lib/posts';
import { getSeries } from '@/lib/series';
import { SITE } from '@/site';

export const getStaticPaths = (async () => {
  const [posts, series] = await Promise.all([getPosts(), getSeries()]);
  const seriesTitle = (id: string) => series.find((s) => s.id === id)?.data.title;
  const cards: { path: string; card: OgCard }[] = [
    { path: 'default', card: { title: SITE.description } },
    ...posts.map((post) => {
      const s = post.data.series;
      return {
        path: `posts/${post.id}`,
        card: {
          title: post.data.title,
          kicker: s ? `${seriesTitle(s.id.id)} · Part ${s.part}` : post.data.tags[0],
          meta: isoDate(post.data.pubDate),
        },
      };
    }),
    ...series.map((s) => ({
      path: `series/${s.id}`,
      card: {
        title: s.data.title,
        kicker: `Series · ${s.parts.length} part${s.parts.length > 1 ? 's' : ''}${s.data.status === 'ongoing' ? ' · ongoing' : ''}`,
      },
    })),
  ];
  return cards.map(({ path, card }) => ({ params: { path }, props: { card } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderOgImage(props.card as OgCard)), {
    headers: { 'Content-Type': 'image/png' },
  });
