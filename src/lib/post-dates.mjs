// Publication / update date of every published post, keyed by URL path, for the sitemap's <lastmod>.
// Reads the frontmatter directly: astro.config runs before content collections exist.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const POSTS = 'src/content/posts';

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : /\.mdx?$/.test(e.name) ? [join(dir, e.name)] : [],
  );

export function postDates() {
  const dates = new Map();
  for (const file of files(POSTS)) {
    const front = readFileSync(file, 'utf8').split(/^---$/m)[1] ?? '';
    if (/^draft:\s*true/m.test(front)) continue;
    const date = (front.match(/^updatedDate:\s*(\S+)/m) ?? front.match(/^pubDate:\s*(\S+)/m))?.[1];
    if (date) dates.set(`/posts/${relative(POSTS, file).replace(/\.mdx?$/, '')}/`, new Date(date).toISOString());
  }
  return dates;
}
