# Design direction

Goal: a small personal blog for findings and projects, alive but not "AI slop", and not looking like an ad.

## Directions explored

Four mockups were built with the same content (header, article intro, a GitHub PR card, a code block, post list).

| Direction | Idea | Palette | Verdict |
|---|---|---|---|
| Lab notebook | Ruled paper, serif titles, highlighter underline, margin notes | paper `#F7F3EA`, ink `#1D1B16`, red `#D9480F` | ❌ Ruled background hurts readability, feels AI-generated |
| **Container manifest** | Steel header with an orange stripe, tags as cargo labels, industrial but understated; fits the Podman / containers work | steel `#14202E`, hull `#E4E7EB`, orange `#E8622C` | ✅ **Chosen** |
| Riso zine | Two-ink risograph look, halftone dots, misregistered shapes | cream `#FFF8EC`, blue `#2D4BCB`, pink `#FF5C8A` | ❌ Colours make text hard to read, feels AI-generated |
| Quiet terminal | Dark first, mono headings, `ls posts/` index, amber accent | `#111214`, amber `#E0A84E` | ❌ Liked, but too many sites look like this |

## Decisions after review

- **Kept** from the manifest direction: steel header with orange stripe, `AXEL7083/BLOG` brand, cargo-label tags
  (first tag orange), condensed display titles, orange square before `h2`, dark code blocks with an orange left edge.
- **Removed**: the "MANIFEST / LOADED / TRANSIT" box and `MF-00x` post numbers. They felt pointless.
  Posts show a single meta line instead: `2026-01-31 · 6 MIN READ`.
- **Navigation**: only **Writing** (`/posts/`) and the theme toggle. No "Log", no visible RSS link
  (the feed still exists and is advertised in `<head>`).
- **"Writing"** matches the wording of the GitHub profile README (Speaking / Writing).
- **Home page**: bio as the headline, 5 latest posts, "All writing →".
- **Only blog posts**: no activity widgets, projects page or "now" page.
- **GitHub cards keep GitHub's own palette and font** in both themes, so they stay recognizable. Only the hover
  border uses the site's orange.
- **Readability first**: IBM Plex Sans 18px body, prose text never decorated.

## Tokens

Defined in `src/styles/global.css`.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#e4e7eb` | `#0f1822` |
| `--surface` | `#ffffff` | `#16212d` |
| `--fg` | `#14202e` | `#e4e7eb` |
| `--muted` | `#5b6775` | `#8c98a6` |
| `--border` | `#c3cad2` | `#2a3746` |
| `--frame` (header) | `#14202e` | `#0a1119` |
| `--accent` | `#e8622c` | `#f07a45` |

Fonts (self-hosted by the Astro fonts API, `astro.config.mjs`): IBM Plex Sans (body), IBM Plex Sans Condensed
(titles, labels), IBM Plex Mono (code, metadata).

## Icon (2026-11-22)

An "AS" monogram (Axel Stefanini): white condensed letters on steel, with the header's orange band on top.
Used as the favicon (ICO 16/32/48 and a 96 px PNG for Google; no SVG), Apple and Android icons, and next to
the brand in the header (it replaced the `▣` mark). Rejected: the `▣` mark ("ugly"), a lone "A", `a/`, an
orange tile, container doors.
