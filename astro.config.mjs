// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';

import externalLinks from './src/lib/external-links.mjs';
import { postDates } from './src/lib/post-dates.mjs';

const lastModified = postDates();

// https://astro.build/config
export default defineConfig({
  // Custom domain, set in the GitHub Pages settings (DNS: CNAME axel → axel7083.github.io).
  site: 'https://axel.stefanini.dev',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    svelte(),
    sitemap({
      // Search engines recrawl what changed: posts get their updated (or publication) date.
      serialize: (item) => ({ ...item, lastmod: lastModified.get(new URL(item.url).pathname) ?? item.lastmod }),
      filter: (page) => !page.includes('/og/'),
    }),
  ],
  image: {
    // GitHub avatars are downloaded and optimized at build time.
    domains: ['avatars.githubusercontent.com'],
  },
  // Fonts are downloaded at build time and served from the site itself.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-sans',
      weights: [400, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans Condensed',
      cssVariable: '--font-display',
      weights: [600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
  markdown: {
    // MDX inherits this processor, so its plugins run on posts too.
    processor: satteri({ hastPlugins: [externalLinks] }),
    shikiConfig: {
      // Code blocks are always dark, framed like the site header.
      theme: 'github-dark-default',
    },
  },
});
