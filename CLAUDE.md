@AGENTS.md

## Project context

Personal blog of axel7083 (Axel Stefanini). Read `docs/` before design or framework changes:
- `docs/framework-comparison.md` — why Astro + MDX + Svelte islands.
- `docs/design-direction.md` — chosen visual direction, rejected options and the user's feedback.

## Conventions

- Zero client JS by default. GitHub cards and anything data-driven render at build time;
  Svelte islands only for real interactivity (currently just `ThemeToggle.svelte`, `client:only`).
- GitHub cards (`src/components/github/`) keep GitHub's own palette and font; never theme them with site tokens.
- Never render private repositories in cards (guard in `src/lib/github.ts`).
- Site tokens live in `src/styles/global.css`; keep the container metaphor in the page chrome, never in prose.
- Navigation stays minimal: brand, "Writing", theme toggle. Only blog posts, no extra widgets.
- Draft posts (`draft: true`) are visible in dev only. Don't write post content on the user's behalf;
  leave TODOs for them.
- Verify UI changes with `npx astro check`, `npm run build` and a screenshot of light, dark and mobile.

## Repositories and publishing

- `axel7083/blog` (public, remote `public`): `main` only, published posts only. Pushing `main` deploys
  GitHub Pages at https://axel.stefanini.dev. CI fails if a draft or `docs/nas-*` reaches it.
- `axel7083/blog-drafts` (private, remote `private`): `main` mirrored, plus the `drafts` branch (main +
  draft posts + research notes in `docs/nas-*`) and work branches. Never push these to `public`.
- Publish a post: on `main`, `git checkout drafts -- <post>`, set `draft: false`, commit, push `main` to both
  remotes, then merge `main` into `drafts`.

## Open items

- DNS for `axel.stefanini.dev`: CNAME `axel` → `axel7083.github.io`, domain verified on the GitHub account.
- Three draft posts await their content (FOSDEM 2025, FOSDEM 2026, Red Hat Developers article).
- "Building my NAS" series (`src/content/posts/nas/`, plan in `docs/nas-series.md`): 15 parts: part 1 written (branch `nas/01-picking-the-hardware`), the rest outlined.
  Cite sources with footnotes; nas-config is private, so cite its issues as text, not cards.
- Per-post social preview image; optional Google News sitemap.
