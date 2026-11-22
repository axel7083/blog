# Framework comparison (November 2026)

Research done before starting the blog, to pick a static site framework.

## Requirements

- Hosted on **GitHub Pages** with a custom domain → full static generation (SSG), no server.
- **Custom components** inside posts, not plain Markdown.
- **Light and fast**: minimal JavaScript, good Core Web Vitals.
- **Readable by AI crawlers**: full content in the HTML, clean semantic markup.
- **Correct metadata** for Google Search / Google News: OpenGraph, JSON-LD (`BlogPosting` / `NewsArticle`),
  sitemap, RSS.

## Comparison

| Framework | Components in posts | JS shipped by default | SEO / metadata tooling | GitHub Pages fit | Notes |
|---|---|---|---|---|---|
| **Astro** | MDX + `.astro` components; islands in Svelte / React / Vue / Solid | **0 KB** (JS only for islands you opt in) | Official sitemap + RSS integrations, typed content collections, full `<head>` control | Official `withastro/action` | Built for content sites: image optimization, fonts API, Shiki highlighting at build time |
| Eleventy 3 | WebC / Nunjucks shortcodes | 0 KB | RSS / sitemap plugins, JSON-LD by hand | Easy | Lightest toolchain, but dated component DX and no interactive-island story |
| Hugo | Shortcodes / partials (Go templates) | 0 KB | Built-in sitemap / RSS / OG templates | Easy, fastest builds | Go templates are painful for rich components; interactivity is hand-written JS |
| SvelteKit (`adapter-static`) | mdsvex + Svelte components | Hydration runtime on every page unless `csr = false` per route | Manual (`svelte:head`), community sitemap libraries | Works (`paths.base`, `.nojekyll`) | Great DX, but an app framework; you fight it to get zero-JS pages |
| Next.js (`output: export`) | MDX + React | React runtime (~80–100 KB+) on every page | Good Metadata API | Works, but `next/image` optimization and ISR are unavailable in export | Heaviest option, overkill for a blog |
| Nuxt Content | MDC + Vue | Vue runtime | Good modules (`@nuxtjs/seo`) | Works via `nuxt generate` | Same weight issue as Next.js, Vue flavour |
| VitePress | Vue in Markdown | Vue SPA runtime | Basic | Easy | Documentation-oriented, not a blog engine |

## Decision: Astro + MDX + Svelte islands

- The only option combining **zero-JS HTML by default** with **first-class rich components** in posts.
- Islands let a post embed an interactive Svelte widget; only that widget ships JS (`client:visible` loads it lazily).
- Content collections validate frontmatter with a schema, so metadata can't be forgotten.
- Svelte for islands: smallest runtime, and already familiar.
- Runner-up: Eleventy, if absolute minimalism matters more than interactive components.

## SEO / discoverability checklist

Implemented in the POC:

- Canonical URL, description, OpenGraph and Twitter tags, `article:*` times and tags (`src/components/seo/Head.astro`).
- JSON-LD `BlogPosting` on posts, `WebSite` on other pages.
- `sitemap-index.xml` (`@astrojs/sitemap`), `rss.xml`, `robots.txt` allowing all crawlers, `llms.txt`.
- Optional `canonical` frontmatter for posts republished from elsewhere.

Still to do:

- Social preview image per post (≥ 1200 px wide, needed for Google Discover / News).
- Google News sitemap (posts from the last 48 h) and Publisher Center registration, if Google News matters.
- Register in Google Search Console once the custom domain is live.
