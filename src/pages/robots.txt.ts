import type { APIRoute } from 'astro';

// Explicitly welcome search engines and AI crawlers.
export const GET: APIRoute = ({ site }) =>
  new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('sitemap-index.xml', site).href}`, ''].join('\n'),
  );
