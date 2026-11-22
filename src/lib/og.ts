// Link-preview images (Open Graph, 1200×630), rendered at build time: satori lays out the card as SVG,
// resvg rasterises it. Same look as the site chrome: steel background, orange stripe, condensed title.
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFile(require.resolve(`@fontsource/${pkg}/files/${file}`));

// The AS monogram, as in the site header (public/icon-192.png, downscaled by satori).
const monogram = readFile('public/icon-192.png').then((png) => `data:image/png;base64,${png.toString('base64')}`);

const fonts = Promise.all([
  font('ibm-plex-sans-condensed', 'ibm-plex-sans-condensed-latin-700-normal.woff'),
  font('ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff'),
]).then(([display, mono]) => [
  { name: 'Display', data: display, weight: 700 as const, style: 'normal' as const },
  { name: 'Mono', data: mono, weight: 500 as const, style: 'normal' as const },
]);

const STEEL = '#14202e';
const HULL = '#e4e7eb';
const MUTED = '#8c98a6';
const ORANGE = '#e8622c';

export interface OgCard {
  title: string;
  /** Small orange label above the title, e.g. "Building my NAS · Part 1". */
  kicker?: string;
  /** Bottom-left line, e.g. the date. */
  meta?: string;
}

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

export async function renderOgImage({ title, kicker, meta }: OgCard): Promise<Buffer> {
  // Long titles step down so they stay on at most three lines.
  const size = title.length > 70 ? 64 : title.length > 45 ? 76 : 88;
  const card = el('div', { display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: STEEL }, [
    el('div', { display: 'flex', alignItems: 'center', padding: '44px 64px 36px', fontFamily: 'Mono', fontSize: 30, letterSpacing: 4, color: HULL }, [
      { type: 'img', props: { src: await monogram, width: 48, height: 48, style: { borderRadius: 8, marginRight: 20 } } },
      'AXEL7083',
      el('span', { color: ORANGE }, '/'),
      'BLOG',
    ]),
    el('div', { height: 8, background: ORANGE }),
    el('div', { display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, padding: '0 64px' }, [
      ...(kicker
        ? [el('div', { fontFamily: 'Mono', fontSize: 28, letterSpacing: 4, color: ORANGE, textTransform: 'uppercase', marginBottom: 20 }, kicker)]
        : []),
      el('div', { fontFamily: 'Display', fontSize: size, lineHeight: 1.08, color: HULL }, title),
    ]),
    el('div', { display: 'flex', justifyContent: 'space-between', padding: '0 64px 44px', fontFamily: 'Mono', fontSize: 26, color: MUTED }, [
      el('div', {}, meta ?? ''),
      el('div', {}, 'axel.stefanini.dev'),
    ]),
  ]);

  const svg = await satori(card as never, { width: 1200, height: 630, fonts: await fonts });
  return new Resvg(svg).render().asPng();
}
