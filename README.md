# axel7083 blog

Personal blog built with [Astro](https://astro.build), MDX and Svelte islands, deployed to GitHub Pages.

## Development

```sh
npm install
GITHUB_TOKEN=$(gh auth token) npm run dev   # token optional, raises the GitHub API rate limit
npm run build                                # static output in dist/
npx astro check                              # type check
```

## Writing a post

Create `src/content/posts/<slug>.mdx`:

```mdx
---
title: 'Title'
description: 'Used for the post list, search engines and social previews.'
pubDate: 2026-11-21
tags: ['podman']
draft: true            # visible in dev only
# canonical: https://… # when first published elsewhere
# talk:                # written version of a conference talk
#   event: 'FOSDEM 2026'
#   date: 2026-01-31
#   url / slides / video: https://…
---

import { GitHub, GitHubIssue, GitHubPR, GitHubRepo } from '@/components/github';
import TalkVideo from '@/components/TalkVideo.astro';

<GitHubRepo repo="owner/name" />
<GitHubIssue repo="owner/name" number={123} />
<GitHubPR repo="owner/name" number={456} />
<GitHub url="https://github.com/owner/name/pull/456" />
```

GitHub cards are fetched **at build time** and rendered as plain HTML (no client JS). Private repositories are
refused, and any API failure degrades to a plain link instead of breaking the build.

## Series

A series groups smaller, scoped posts that tell one longer story. Describe it once in
`src/content/series/<id>.md`:

```md
---
title: 'Building my NAS'
description: 'One sentence for the series page and the Writing index.'
status: ongoing        # or complete
---

Optional intro, shown on /series/<id>/.
```

Then add it to each post's frontmatter:

```yaml
series:
  id: nas      # file name in src/content/series
  part: 3      # reading order, 1-based
```

Each part gets a collapsible table of contents at the top and previous/next links at the bottom. The series is
listed on the Writing page and at `/series/<id>/`. A series appears only once at least one of its parts is
published; drafts stay dev-only, as for any post.

## Sources

Cite with footnotes: `text[^ovh]` and, at the end, `[^ovh]: [OVHcloud prices](https://…), checked 2026-11-11.`
They render as a numbered "Sources" list. An unreferenced footnote is dropped.

## Docs

- [Framework comparison](docs/framework-comparison.md)
- [Design direction](docs/design-direction.md)
