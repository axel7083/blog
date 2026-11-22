import type { APIRoute } from 'astro';
import { getPosts } from '@/lib/posts';
import { getSeries } from '@/lib/series';
import { SITE } from '@/site';

// https://llmstxt.org — a Markdown index of the site for LLM-based tools.
export const GET: APIRoute = async ({ site }) => {
  const [posts, series] = await Promise.all([getPosts(), getSeries()]);
  const lines = [
    `# ${SITE.title}`,
    '',
    `> ${SITE.description}`,
    '',
    ...(series.length
      ? [
          '## Series',
          '',
          ...series.flatMap((s) => [
            `### [${s.data.title}](${new URL(`/series/${s.id}/`, site).href})`,
            '',
            s.data.description,
            '',
            ...s.parts.map(
              (p, i) => `${i + 1}. [${p.data.title}](${new URL(`/posts/${p.id}/`, site).href}): ${p.data.description}`,
            ),
            '',
          ]),
        ]
      : []),
    '## Posts',
    '',
    ...posts.map((p) => `- [${p.data.title}](${new URL(`/posts/${p.id}/`, site).href}): ${p.data.description}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
